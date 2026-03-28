# Formulario de Caracterización POE

Aplicación web para diligenciar la caracterización de estudiantes y familias del Plan de Orientación Escolar (POE), con interfaz amigable y estructura modular para mantenimiento profesional.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

## Objetivo

Facilitar el registro de información de caracterización de forma clara para estudiantes, acudientes y docentes, con almacenamiento en Google Sheets y consulta por documento de identidad.

## Características principales

- Interfaz por pasos (3 secciones):
  - Datos del estudiante
  - Académico y socioemocional
  - Módulo familiar
- Diseño moderno, adaptable a celular y escritorio.
- Guardado en Google Sheets (nube institucional).
- Búsqueda por número de documento.
- Indicadores de base de datos:
  - Total de registros
  - Último registro/cambio
- Guardado de borrador local en navegador (protege datos mientras se diligencia).
- Validaciones de campos obligatorios y lógica condicional (etnia, discapacidad, etc.).

## Estructura del proyecto

```text
Caracterizacion/
├── index.html
├── css/
│   ├── global.css
│   ├── layout.css
│   ├── components.css
│   └── themes.css
├── js/
│   ├── config.js
│   ├── main.js
│   ├── navigation.js
│   ├── storage.js
│   ├── api.js
│   └── ui.js
└── README.md
```

## Descripción de módulos JS

- `config.js`: configuración general (URL Apps Script, ID de hoja, secciones).
- `main.js`: inicialización de la app y orquestación de eventos.
- `navigation.js`: control del flujo por secciones.
- `storage.js`: borrador local (`localStorage`).
- `api.js`: integración con Apps Script y fallback de lectura de hoja.
- `ui.js`: renderizado, alertas, validaciones y actualización de estado visual.


## Flujo de datos

1. Usuario diligencia formulario.
2. App valida y prepara payload.
3. App envía datos al Apps Script (`POST`).
4. Búsqueda y estadísticas se consultan por Apps Script (`GET`) y, si es necesario, usan fallback de lectura de Google Sheets.

## Estado actual

- UI renovada y modular.
- Código separado por responsabilidades.
- Compatible con mantenimiento escalable.

## Recomendaciones de despliegue

- Mantener la hoja de cálculo en nube institucional.
- Publicar Apps Script como Web App con permisos controlados.
- No exponer credenciales o tokens en frontend.

## Licencia

Uso institucional/educativo según lineamientos del proyecto.
