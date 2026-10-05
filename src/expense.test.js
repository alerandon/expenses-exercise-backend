const { applyExpense, ExpenseError } = require('./expense');

describe('Pruebas para la función applyExpense', () => {
    
    test('1. [record] Debería registrar un gasto y permitir que el saldo quede negativo', () => {
        const result = applyExpense("1250.75", "1300.00", "USD", "record");
        expect(result).toBe("-49.25");
    });

    test('2. [payment] Debería procesar un pago exacto exitosamente', () => {
        const result = applyExpense("1250.75", "1250.75", "EUR", "payment");
        expect(result).toBe("0"); // Se descuenta todo el saldo
    });

    test('3. [payment] Debería rechazar un pago si hay fondos insuficientes', () => {
        expect.assertions(2);
        try {
            applyExpense("100", "101.50", "VES", "payment");
        } catch (error) {
            expect(error).toBeInstanceOf(ExpenseError);
            expect(error.code).toBe('INSUFFICIENT_FUNDS');
        }
    });

    test('4. Decimales: Debería rechazar si el monto tiene más decimales de lo permitido', () => {
        expect.assertions(2);
        try {
            applyExpense("100.00", "50.123", "USD", "record"); // USD solo permite 2
        } catch (error) {
            expect(error).toBeInstanceOf(ExpenseError);
            expect(error.code).toBe('INVALID_AMOUNT');
        }
    });

    test('5. Decimales: Debería permitir hasta 6 decimales para USDT y operar correctamente', () => {
        const result = applyExpense("1.000000", "0.000001", "USDT", "payment");
        // 1.000000 - 0.000001 = 0.999999
        expect(result).toBe("0.999999");
    });

    test('6. Montos: Debería rechazar montos menores o iguales a 0', () => {
        expect.assertions(4);
        
        try { applyExpense("100", "0", "USD", "payment"); } 
        catch (e) { 
            expect(e).toBeInstanceOf(ExpenseError);
            expect(e.code).toBe('INVALID_AMOUNT'); 
        }

        try { applyExpense("100", "-50", "USD", "record"); } 
        catch (e) { 
            expect(e).toBeInstanceOf(ExpenseError);
            expect(e.code).toBe('INVALID_AMOUNT'); 
        }
    });
});
