## PROBLEMAS DEL EJERCICIO EN LA PARTE 2

1. **No se valida si la cuenta es del usuario:** Se recibe el `uid`, pero nunca se comprueba que esa cuenta realmente le pertenezca a la persona que hace la petición.
* *Solución:* Comprobar que `account.uid === uid` antes de hacer cualquier movimiento.


2. **No maneja transacciones de base de datos:** Si la app guarda el nuevo saldo pero falla al registrar la transacción, el dinero se descuenta pero no queda constancia de la operación.
* *Solución:* Envolver las operaciones en una transacción de base de datos para que si algo falla, se cancele todo.


3. **Falta validar el monto ingresado:** No se revisa si el monto es un número válido, un valor negativo o cero.
* *Solución:* Verificar que `value` sea un número válido y mayor a cero antes de operar.


4. **No controla si la cuenta no existe:** Si no encuentra la cuenta en la base de datos, el código falla al intentar leer `account.balance`.
* *Solución:* Verificar si `account` existe y lanzar un mensaje claro si no se encuentra.
