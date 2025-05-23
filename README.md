# Amazon Clone Dashboard

Este proyecto es un clon de Amazon con un dashboard modular para diferentes roles de usuario (usuarios, vendedores, administradores y superadmins).

## Nuevos cambios

### Autenticación y login

- Se ha implementado un nuevo sistema de autenticación con Auth0 para producción y un mock para desarrollo.
- Se han creado formularios de login, registro y recuperación de contraseña.
- Se ha implementado un sistema de roles (usuario, vendedor, administrador, superadmin).
- Se ha añadido protección de rutas mediante middleware.

### Navbar (Header)

- Se ha modificado el componente Header para mostrar diferentes opciones según el rol del usuario.
- Se ha añadido un dropdown con opciones personalizadas para cada rol.
- Se ha implementado la funcionalidad de cierre de sesión.

### Hooks personalizados

- Se han creado hooks personalizados para centralizar la lógica de la aplicación.
- Se ha implementado una separación clara entre código de cliente y servidor.

## Hooks creados

- `useFetchData`: Hook para realizar peticiones a la API con manejo de estados (loading, error, data).
- `useDatabaseConnection`: Hook para gestionar la conexión a la base de datos.
- `useForm`: Hook para gestionar formularios con validación y manejo de errores.

## Microservicios

### Endpoints de autenticación

- `POST /api/auth/login`: Iniciar sesión.
- `POST /api/auth/register`: Registrar un nuevo usuario.
- `POST /api/auth/logout`: Cerrar sesión.
- `POST /api/auth/forgot-password`: Solicitar cambio de contraseña.

### Endpoints de usuarios

- `GET /api/users`: Obtener todos los usuarios.
- `GET /api/users/:id`: Obtener un usuario por ID.
- `PUT /api/users/:id`: Actualizar un usuario.
- `DELETE /api/users/:id`: Eliminar un usuario.

### Endpoints de productos

- `GET /api/products`: Obtener todos los productos.
- `GET /api/products/:id`: Obtener un producto por ID.
- `POST /api/products`: Crear un nuevo producto.
- `PUT /api/products/:id`: Actualizar un producto.
- `DELETE /api/products/:id`: Eliminar un producto.

## Autenticación

### Flujo de autenticación

1. El usuario accede a `/auth/login` o `/auth/register`.
2. Introduce sus credenciales o datos de registro.
3. Si las credenciales son válidas, se crea una cookie de sesión.
4. El usuario es redirigido a la página principal.
5. El middleware protege las rutas del dashboard según el rol del usuario.

### Cambio de contraseña

1. El usuario accede a `/auth/forgot-password`.
2. Introduce su correo electrónico.
3. Se envía un correo con instrucciones para restablecer la contraseña.
4. El usuario accede al enlace del correo y establece una nueva contraseña.

## Usuarios de prueba

Para el modo de desarrollo (mock), se han creado los siguientes usuarios:

- **Usuario normal**:
  - Email: user@example.com
  - Contraseña: password123
  - Rol: user

- **Vendedor**:
  - Email: seller@example.com
  - Contraseña: password123
  - Rol: seller

- **Administrador**:
  - Email: admin@example.com
  - Contraseña: password123
  - Rol: admin

- **Superadmin**:
  - Email: superadmin@example.com
  - Contraseña: password123
  - Rol: superadmin

## Usuarios creados

Los usuarios creados se almacenan en:

- **MongoDB**: Colección `users`.
- **Supabase**: Tabla `users`.
- **Mock**: Array en memoria `mockUsers`.

## Configuración de Auth0

Para configurar Auth0 en producción:

1. Crear una cuenta en [Auth0](https://auth0.com/).
2. Crear una aplicación de tipo "Regular Web Application".
3. Configurar las URLs de callback y logout.
4. Añadir las siguientes variables de entorno:
   - `AUTH0_SECRET`: Un string aleatorio para firmar cookies.
   - `AUTH0_BASE_URL`: URL base de la aplicación.
   - `AUTH0_ISSUER_BASE_URL`: URL del dominio de Auth0.
   - `AUTH0_CLIENT_ID`: ID del cliente de Auth0.
   - `AUTH0_CLIENT_SECRET`: Secret del cliente de Auth0.
   - `AUTH0_NAMESPACE`: Namespace para los roles en el token JWT.

## Recomendaciones

- Implementar caching para la autenticación para mejorar el rendimiento.
- Añadir notificaciones para el cambio de contraseña y otras acciones importantes.
- Revisar periódicamente los componentes y hooks para evitar redundancias.
- Implementar pruebas unitarias y de integración para asegurar la calidad del código.
- Considerar la implementación de un sistema de logs para monitorear la actividad de los usuarios.
