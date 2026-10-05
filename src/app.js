const express = require('express');
const { applyExpense, ExpenseError } = require('./expense');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API funcionando');
});

app.post('/expense', (req, res) => {
    const { balance, amount, currency, kind } = req.body;

    try {
        const newBalance = applyExpense(balance, amount, currency, kind);
        return res.status(200).json({ newBalance });
    } catch (error) {
        if (error instanceof ExpenseError) {
            return res.status(400).json({
                error: error.code,
                message: error.message,
            });
        }
        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Ocurrió un error inesperado',
        });
    }
});

module.exports = app;

