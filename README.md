# Administrador

Este archivo JSON representa un usuario administrador de ejemplo con los campos:
- "username": nombre de usuario
- "email": correo electrónico
- "password": contraseña (en texto plano solo para ejemplo, en la base de datos se almacena encriptada)
- "role": rol del usuario, en este caso "admin" para permisos administrativos

# Gelatitinas - Sistema de Autenticación con JWT

## Descripción

Este proyecto implementa un sistema de autenticación seguro usando JSON Web Tokens (JWT) para la aplicación Gelatitinas. JWT permite verificar la identidad del usuario sin mantener sesiones en el servidor.

## Características

- Registro de usuarios con contraseñas almacenadas de forma segura usando bcrypt
- Inicio de sesión que genera tokens JWT para autenticación
- Rutas protegidas que requieren autenticación mediante tokens
- Almacenamiento del token JWT y datos básicos del usuario en localStorage del navegador
- Cierre de sesión que elimina el token y datos del usuario

## Estructura del Proyecto

```
├── backend/                # Código del servidor
│   ├── config/            # Configuración, como conexión a base de datos
│   │   └── db.js          # Archivo para configurar MongoDB
│   ├── middleware/        # Middlewares para autenticación y autorización
│   │   └── auth.js        # Middleware para verificar tokens JWT
│   ├── models/            # Modelos de datos para MongoDB
│   │   └── user.js        # Modelo de usuario
│   ├── routes/            # Rutas API
│   │   ├── auth.js        # Rutas para registro e inicio de sesión
│   │   └── protected.js   # Rutas protegidas que requieren token
│   └── server.js          # Configuración y arranque del servidor Express
├── frontend/              # Código del cliente (interfaz web)
│   ├── home.html          # Página principal que requiere autenticación
│   ├── index.html         # Página de inicio de sesión
│   ├── register.html      # Página de registro de usuarios
│   └── style.css          # Estilos CSS para la interfaz
├── .env                   # Variables de entorno (URI de MongoDB, clave secreta JWT)
└── package.json           # Dependencias y scripts del proyecto
```

## Cómo funciona la autenticación JWT

1. **Registro de usuario**:
   - El usuario ingresa nombre de usuario, correo y contraseña
   - La contraseña se encripta con bcrypt antes de guardarla
   - Se genera un token JWT y se envía al cliente

2. **Inicio de sesión**:
   - El usuario ingresa nombre de usuario y contraseña
   - Se verifica la contraseña con bcrypt
   - Si es correcta, se genera un token JWT y se envía al cliente

3. **Almacenamiento del token**:
   - El token JWT se guarda en localStorage del navegador
   - También se guardan datos básicos del usuario (ID, nombre de usuario)

4. **Acceso a rutas protegidas**:
   - El cliente envía el token JWT en el encabezado 'auth-token' en las solicitudes
   - El middleware verifica el token
   - Si es válido, se permite el acceso
   - Si no, se deniega

5. **Cierre de sesión**:
   - Se elimina el token y datos del usuario de localStorage
   - Se redirige al usuario a la página de inicio de sesión

## Seguridad

- Las contraseñas se almacenan encriptadas con bcrypt, nunca en texto plano
- Los tokens JWT están firmados con una clave secreta en variables de entorno
- Los tokens tienen expiración (1 hora)
- Las rutas protegidas verifican el token antes de permitir acceso

## Tecnologías utilizadas

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Autenticación**: JSON Web Tokens (JWT)