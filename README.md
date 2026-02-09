# 📋 Formulario de Caracterización Estudiantil - Plan de Orientación Escolar

Este proyecto es una aplicación web progresiva (Single Page Application) diseñada para recolectar, gestionar y digitalizar la información de caracterización de estudiantes. El sistema utiliza **Google Sheets** como base de datos backend, permitiendo una gestión de información sin costos de servidor y con actualización en tiempo real.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

## ✨ Características Principales

* **Arquitectura Serverless:** No requiere base de datos SQL ni servidor backend tradicional; todo se almacena en una Hoja de Cálculo de Google.
* **Interfaz Guiada por Pasos:** Formulario dividido en 3 secciones lógicas (Datos Personales, Académico/Socioemocional, Familiar) con barra de progreso.
* **Diseño Responsivo:** Estilos CSS modernos (Flexbox/Grid) optimizados para PC, Tablets y Móviles.
* **Validación en Tiempo Real:** Campos obligatorios, cálculo automático de edad y lógica condicional (ej. preguntas sobre discapacidad o etnia).
* **Modo Offline (Parcial):** La configuración de la URL del script se guarda en el `localStorage` del navegador.
* **Funciones CRUD:**
    * ➕ **Crear:** Nuevos registros de estudiantes.
    * 🔍 **Buscar:** Consulta de estudiantes por número de documento (conecta con Sheets para traer datos).
