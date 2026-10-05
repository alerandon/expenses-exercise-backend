# Expenses Exercise Backend

Este proyecto es un ejercicio práctico de desarrollo Backend en Node.js y Express enfocado en la precisión en operaciones financieras y diseño de APIs seguras.

El proyecto está estructurado en dos partes principales:

---

## 📌 Parte 1: Función de Gastos (`applyExpense`) y API REST

La **Parte 1** comprende la implementación de la función `applyExpense` ubicada en [`src/expense.js`](./src/expense.js) y su integración en un servidor Web con Express.

### Lógica de la Función `applyExpense`
* **Precisión Matemática**: Utiliza aritmética con `BigInt` para evitar errores de punto flotante en valores monetarios.
* **Validación de Decimales**:
  * **USD**, **VES**, **EUR**: Máximo 2 decimales.
  * **USDT**: Máximo 6 decimales.
  * Rechaza valores con más decimales de los permitidos (sin redondear).
* **Tipos de Movimiento (`kind`)**:
  * `record`: Registra un gasto pasado. Permite que el saldo resultante sea negativo.
  * `payment`: Ejecuta un pago. Requiere saldo suficiente (un pago exacto es permitido).
* **Manejo de Errores**: Lanza `ExpenseError` con códigos distinguibles: `INVALID_AMOUNT` y `INSUFFICIENT_FUNDS`.

---

### 🚀 Cómo Ejecutar el Proyecto

#### 1. Instalación de Dependencias
```bash
npm install
```

#### 2. Iniciar Servidor HTTP
```bash
npm start
```
El servidor estará corriendo en `http://localhost:3000`.

#### 3. Ejecutar Pruebas Unitarias y de Integración
```bash
npm test
```

---

### 📡 Documentación de Rutas API

#### `POST /expense`

Endpoint para procesar un gasto o pago de cuenta.

##### Body de la Petición (`application/json`)
```json
{
  "balance": "1250.75",
  "amount": "100.00",
  "currency": "USD",
  "kind": "payment"
}
```

##### Parámetros esperados:
* `balance` *(string)*: Saldo actual de la cuenta.
* `amount` *(string)*: Monto a gastar/pagar (debe ser mayor a 0).
* `currency` *(string)*: Moneda (`"USD"`, `"VES"`, `"EUR"`, `"USDT"`).
* `kind` *(string)*: Tipo de transacción (`"record"` o `"payment"`).

##### Respuestas HTTP

* **200 OK (Operación Exitosa)**
  ```json
  {
    "newBalance": "1150.75"
  }
  ```

* **400 Bad Request (Error de Negocio / Validación)**
  ```json
  {
    "error": "INSUFFICIENT_FUNDS",
    "message": "Saldo insuficiente para realizar el pago"
  }
  ```
  ```json
  {
    "error": "INVALID_AMOUNT",
    "message": "El monto tiene más decimales de los permitidos"
  }
  ```

---

## 📌 Parte 2: Análisis de Código y Respuestas

En el archivo [`docs/RESPUESTAS.md`](./docs/RESPUESTAS.md) se enumeran y detallan los problemas identificados en el bloque de código propuesto para la Parte 2 del ejercicio (incluyendo manejo de transacciones, concurrencia y violaciones a los principios ACID).
