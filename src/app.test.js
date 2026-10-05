const request = require('supertest');
const app = require('./app');

describe('POST /expense API Integration Tests', () => {
    test('Debería retornar 200 y el nuevo saldo cuando la solicitud es válida', async () => {
        const response = await request(app)
            .post('/expense')
            .send({
                balance: '1000.00',
                amount: '250.50',
                currency: 'USD',
                kind: 'payment'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ newBalance: '749.5' });
    });

    test('Debería retornar 400 y el código INSUFFICIENT_FUNDS si el saldo no alcanza', async () => {
        const response = await request(app)
            .post('/expense')
            .send({
                balance: '100.00',
                amount: '200.00',
                currency: 'USD',
                kind: 'payment'
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'INSUFFICIENT_FUNDS',
            message: 'Saldo insuficiente para realizar el pago'
        });
    });

    test('Debería retornar 400 y el código INVALID_AMOUNT si los decimales son inválidos', async () => {
        const response = await request(app)
            .post('/expense')
            .send({
                balance: '100.00',
                amount: '50.123',
                currency: 'USD',
                kind: 'record'
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'INVALID_AMOUNT',
            message: 'El monto tiene más decimales de los permitidos'
        });
    });
});
