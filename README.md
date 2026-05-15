# Aura Store - E-Commerce Full-Stack

Este proyecto es una plataforma completa de comercio electrónico (Tienda Online) desarrollada como práctica de arquitectura Full-Stack utilizando **Next.js** para el frontend y **NestJS** para el backend. 

El objetivo principal de este proyecto es implementar un sistema integral que maneje autenticación segura, gestión de roles de usuario, un catálogo interactivo de productos y un sistema completo de carrito de compras.

## 🚀 Características Principales

*   **Autenticación y Seguridad:** Sistema de registro y login basado en **JWT (JSON Web Tokens)**. Las rutas están protegidas dependiendo del estado de la sesión y del perfil del usuario (`user` o `admin`).
*   **Diseño Premium (Glassmorphism):** El frontend se ha construido sin depender de librerías CSS externas de utilidad. Se utiliza CSS nativo con una estética moderna en modo oscuro, efectos de desenfoque (glassmorphism) y animaciones fluidas.
*   **Catálogo y Buscador:** Los usuarios pueden ver el listado de productos disponibles y utilizar un buscador en tiempo real para encontrar artículos concretos.
*   **Gestión de Productos (CRUD):** Los usuarios registrados tienen acceso a un panel para añadir nuevos productos al sistema, así como editar o borrar los existentes.
*   **Carrito de Compras:** Sistema completo donde los usuarios pueden:
    *   Añadir productos al carrito desde la vista de detalle.
    *   Revisar el estado del carrito, viendo el subtotal calculado en vivo.
    *   Modificar la cantidad de cada producto (+ / -) o eliminarlos por completo.
    *   Realizar el pago (Checkout), lo cual actualiza la base de datos registrando la fecha de compra y vacía el carrito.
*   **Panel de Administración:** El rol `admin` tiene un panel exclusivo para gestionar los perfiles del resto de usuarios de la plataforma, pudiendo otorgar privilegios de administrador a otras cuentas.

## 🛠️ Tecnologías Utilizadas

### Backend (API REST)
*   **Framework:** NestJS
*   **Lenguaje:** TypeScript
*   **Base de Datos:** SQLite (gestionado a través de TypeORM)
*   **Autenticación:** Passport.js y `@nestjs/jwt`
*   **Encriptación:** bcrypt (para el hasheo seguro de contraseñas)

### Frontend (Web)
*   **Framework:** Next.js (App Router)
*   **Lenguaje:** TypeScript, React
*   **Estilos:** Vanilla CSS (globals.css) enfocado en animaciones y UI reactiva.

## ⚙️ Instalación y Ejecución Local

Para levantar el proyecto en tu entorno local, necesitarás tener instalado Node.js. El proyecto está dividido en dos directorios independientes que deben ejecutarse en paralelo.

### 1. Levantar el Backend
La API corre por defecto en el puerto `3001`.

```bash
cd backend
npm install
npm run start:dev
```
*(Nota: El archivo de base de datos `database.sqlite` se generará automáticamente en esta carpeta).*

### 2. Levantar el Frontend
La aplicación web corre por defecto en el puerto `3000`.

```bash
cd frontend
npm install
npm run dev
```

Una vez que ambos servidores estén funcionando, abre tu navegador y visita [http://localhost:3000](http://localhost:3000) para interactuar con la tienda.