# Caracterización · I. E. Paulo VI

Formulario público para familias de estudiantes de sexto a once. Diseño adaptable,
ficha de consulta del registro en curso y tres secciones de caracterización.

## Privacidad y recepción

La página pública no busca estudiantes, no lista registros y no lee Google Sheets.
Cada apertura empieza con una ficha nueva. No guarda datos personales en localStorage.
El archivo de Google Drive `caracterizacion` debe permanecer privado.

**Recepción habilitada:** el receptor de `apps-script/Code.gs` está desplegado
y su URL está configurada en `js/config.js`. Se verificó un envío ficticio desde
el formulario y su recepción en el archivo privado `caracterizacion`.
El receptor agrega registros nuevos, conserva las filas existentes y permite
confirmar un envío mediante un identificador aleatorio; no devuelve datos personales.
La clave documento + año sirve al docente para revisar coincidencias;
no permite a una familia sobrescribir registros. Los reintentos del mismo envío
no duplican filas.

Consultar [las instrucciones de activación](apps-script/INSTALACION.md).
Los datos se guardan al pulsar «Enviar registro» y recibir la confirmación; no hay guardado automático de borradores.

Los campos nuevos incluyen lugar de nacimiento (país, departamento y municipio),
dirección, teléfonos de madre/padre/acudiente, grupo sanguíneo, EPS, pertenencia
étnica, situación frente al conflicto y año escolar.

## Vista local

Ejecutar `python3 -m http.server 8766 --bind 127.0.0.1` y abrir
`http://127.0.0.1:8766/?preview=1`. La vista previa no envía registros.

## Verificación

```sh
node tests/recepcion.cjs
node tests/envio.cjs
```

Las pruebas cubren conservación de filas, validación, reintentos,
protección frente a fórmulas y confirmación sin exponer datos personales.
Se revisó la navegación en escritorio y a 390 px de ancho. Además, se comprobó el guardado y la confirmación con la implementación real de Google el 27 de septiembre de 2026.

## Publicación

Repositorio: `lumcab/Caracterizacion`. GitHub Pages sirve la rama `main` desde
su carpeta raíz en https://lumcab.github.io/Caracterizacion/.
El código no incluye registros de estudiantes ni credenciales de Google.
