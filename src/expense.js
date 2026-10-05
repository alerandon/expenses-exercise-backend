class ExpenseError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

const CURRENCY_DECIMALS = {
    USD: 2,
    VES: 2,
    EUR: 2,
    USDT: 6,
};

function parseAmount(valueStr, decimalsAllowed) {
    if (typeof valueStr !== 'string' || !/^-?\d+(\.\d+)?$/.test(valueStr)) {
        throw new ExpenseError('INVALID_AMOUNT', 'El formato del número es inválido');
    }
    const parts = valueStr.split('.');
    const intPart = parts[0];
    const decPart = parts[1] || '';

    if (decPart.length > decimalsAllowed) {
        throw new ExpenseError('INVALID_AMOUNT', 'El monto tiene más decimales de los permitidos');
    }

    const paddedDecPart = decPart.padEnd(decimalsAllowed, '0');
    const isNegative = valueStr.startsWith('-');
    const sign = isNegative ? -1n : 1n;
    const absoluteIntPart = intPart.replace('-', '');

    return BigInt(absoluteIntPart + paddedDecPart) * sign;
}

function formatBigInt(bigIntValue, decimalsAllowed) {
    const isNegative = bigIntValue < 0n;
    const absValueStr = (isNegative ? -bigIntValue : bigIntValue).toString();

    const paddedStr = absValueStr.padStart(decimalsAllowed + 1, '0');
    const intPart = paddedStr.slice(0, -decimalsAllowed);
    let decPart = paddedStr.slice(-decimalsAllowed);

    // Eliminamos los ceros a la derecha de los decimales para no mostrar "0.00" sino "0" si así queda
    decPart = decPart.replace(/0+$/, '');
    const formatted = decPart.length > 0 ? `${intPart}.${decPart}` : intPart;

    return (isNegative && formatted !== '0' ? '-' : '') + formatted;
}

function applyExpense(balance, amount, currency, kind) {
    const maxDecimals = CURRENCY_DECIMALS[currency];
    if (maxDecimals === undefined) {
        throw new ExpenseError('INVALID_AMOUNT', 'Moneda no soportada');
    }

    let balanceBigInt;
    let amountBigInt;

    try {
        balanceBigInt = parseAmount(balance, maxDecimals);
        amountBigInt = parseAmount(amount, maxDecimals);
    } catch (error) {
        if (error instanceof ExpenseError) throw error;
        throw new ExpenseError('INVALID_AMOUNT', 'Error al procesar el monto o saldo');
    }

    if (amountBigInt <= 0n) {
        throw new ExpenseError('INVALID_AMOUNT', 'El monto a gastar/pagar debe ser mayor que 0');
    }

    const newBalanceBigInt = balanceBigInt - amountBigInt;

    if (kind === 'payment' && newBalanceBigInt < 0n) {
        throw new ExpenseError('INSUFFICIENT_FUNDS', 'Saldo insuficiente para realizar el pago');
    }

    return formatBigInt(newBalanceBigInt, maxDecimals);
}

module.exports = { applyExpense, ExpenseError };
