const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de gastos corriendo en http://localhost:${PORT}`);
});
