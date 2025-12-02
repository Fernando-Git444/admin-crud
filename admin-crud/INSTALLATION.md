# Guía de Instalación y Uso - Admin CRUD

## 🚀 Inicio Rápido

### Paso 1: Configurar la Base de Datos MySQL

```bash
# Iniciar sesión en MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE admin_crud;

# Salir
exit;
```

### Paso 2: Configurar el Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_crud
DB_USER=root
DB_PASSWORD=tu_contraseña
```

### Paso 3: Iniciar el Backend

```bash
# Todavía en el directorio backend
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

### Paso 4: Iniciar el Frontend Angular

En una nueva terminal:

```bash
# Desde el directorio raíz del proyecto
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 📝 Uso de la Aplicación

1. **Ver Administradores**: La tabla muestra todos los administradores registrados
2. **Buscar**: Usa la barra de búsqueda para filtrar por ID o Número de Trabajador
3. **Agregar**: Click en el botón "Agregar" para crear un nuevo administrador
4. **Editar**: Click en el icono ✏️ para modificar un administrador
5. **Eliminar**: Click en el icono 🗑️ para eliminar (con confirmación)

## 🔧 Solución de Problemas Comunes

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Asegúrate de que la base de datos `admin_crud` existe

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env` (PORT=3001)
- O mata el proceso: `netstat -ano | findstr :3000` luego `taskkill /PID <PID> /F`

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo
- Verifica la URL en `src/app/services/administradores.service.ts`
- Revisa la configuración de CORS en el backend

## 📦 Build para Producción

```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
npm start
```

Consulta el [README principal](./README.md) para información sobre despliegue con Nginx.
