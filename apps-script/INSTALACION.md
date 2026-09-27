# Activación de la recepción en Google Sheets

El frontend público envía nuevos registros y consulta únicamente la confirmación de su propio intento. No permite leer, buscar ni modificar fichas existentes. Mantener privado el archivo de Drive.

## Publicar el receptor

1. Con la cuenta propietaria, abrir el archivo `caracterizacion` y entrar en **Extensiones → Apps Script**.
2. Revisar si existe un proyecto anterior antes de cambiarlo. Copiar su código como respaldo si lo hay.
3. Colocar el contenido de `Code.gs` en el editor y guardar. La constante `SHEET_ID_` debe coincidir con el ID del archivo de destino; `TAB_ID_` es el identificador de la pestaña, no su posición.
4. Ejecutar `verificarConexion` desde el editor y autorizar el acceso solicitado a las hojas de cálculo. No enviar contraseñas ni tokens por chat. La función solo comprueba la conexión.
5. Elegir **Implementar → Nueva implementación → Aplicación web**. Ejecutar como propietario y permitir acceso a **Cualquier usuario**, incluso sin iniciar sesión, para que las familias puedan enviar registros. Esta opción se aplica al receptor; no compartir públicamente la hoja.
6. Copiar la dirección que termina en `/exec` en `js/config.js`, propiedad `googleScriptUrl`. La dirección `/dev` solo sirve para pruebas del propietario.
7. Abrir la URL del receptor agregando `?action=health`. Debe devolver `ready: true` y la versión del código desplegado.
8. Desde la página, enviar un registro claramente ficticio, identificado como prueba. Verificar la confirmación y la nueva fila en Drive antes de anunciar la recepción a las familias. No usar datos de estudiantes para las pruebas.

Para actualizar el receptor existente, guardar el código y luego **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar**, conservando la misma URL.

## Comportamiento del guardado

- Agrega una fila nueva después de las existentes; no sobrescribe registros por documento.
- Agrega columnas faltantes sin modificar las filas antiguas.
- Registra el año, la fecha de recepción y un identificador aleatorio de envío.
- Serializa escrituras simultáneas y evita duplicados al reintentar con el mismo identificador.
- Conserva como texto documentos y teléfonos, incluidos ceros iniciales, e impide interpretar entradas como fórmulas.
- La respuesta a `receipt` no contiene nombres, documentos ni respuestas del formulario.

## Pruebas locales

```sh
node tests/recepcion.cjs
node tests/envio.cjs
python3 -m http.server 8766 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8766/?preview=1` permite revisar el formulario sin enviar datos.

Referencia: [Aplicaciones web de Google Apps Script](https://developers.google.com/apps-script/guides/web).
