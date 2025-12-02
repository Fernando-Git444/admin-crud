# Admin CRUD - Angular + API + Nginx

Sistema de administración CRUD para gestionar administradores con arquitectura completa de tres capas: Frontend Angular, Backend API REST con Node.js/Express, y servidor web Nginx.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Desarrollo](#desarrollo)
- [Producción](#producción)

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Frontend       │
│  Angular 20     │  Puerto 4200 (desarrollo)
│                 │  Puerto 80 (producción con Nginx)
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  Nginx          │  Puerto 80
│  Reverse Proxy  │  
│  Static Files   │
└────────┬────────┘
         │
         │ Proxy /api/*
         ▼
┌─────────────────┐
│  Backend API    │
│  Node.js        │  Puerto 3000
│  Express        │
└────────┬────────┘
         │
         │ SQL Queries
         ▼
┌─────────────────┐
│  MySQL          │  Puerto 3306
│  Database       │
└─────────────────┘
```

## ✅ Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.0
- **Nginx** >= 1.18 (para producción)
- **Angular CLI** >= 20.x

### Instalación de Requisitos

#### Windows:
```powershell
# Node.js - Descargar desde https://nodejs.org/

# MySQL - Descargar desde https://dev.mysql.com/downloads/mysql/

# Nginx - Descargar desde https://nginx.org/en/download.html

# Angular CLI
npm install -g @angular/cli
```

#### Linux/Mac:
```bash
# Node.js (con nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# MySQL
sudo apt-get install mysql-server  # Ubuntu/Debian
brew install mysql  # Mac

# Nginx
sudo apt-get install nginx  # Ubuntu/Debian
brew install nginx  # Mac

# Angular CLI
npm install -g @angular/cli
```

## 📦 Instalación

### 1. Clonar el repositorio

```bash
cd admin-crud
```

### 2. Configurar la Base de Datos

```bash
# Entrar a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE admin_crud;

# Salir de MySQL
exit;
```

### 3. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 4. Instalar dependencias del Frontend

```bash
cd ../  # Volver al directorio raíz
npm install
```

## ⚙️ Configuración

### Backend - Variables de Entorno

Crear un archivo `.env` en el directorio `backend/`:

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env`:

```env
# Configuración del Servidor
PORT=3000
NODE_ENV=development

# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_crud
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql

# CORS - Origen permitido (Frontend Angular)
CORS_ORIGIN=http://localhost:4200
```

### Frontend - Configuración de API

El frontend ya está configurado para conectarse a `http://localhost:3000/api` en desarrollo.

Para cambiar la URL de la API, editar:
- `src/app/services/administradores.service.ts` (línea 16)

### Nginx - Configuración (Producción)

El archivo de configuración está en `nginx/nginx.conf`.

**En Windows:**
1. Copiar `nginx/nginx.conf` a `C:\nginx\conf\nginx.conf`
2. Ajustar las rutas según tu instalación

**En  Linux/Mac:**
```bash
sudo cp nginx/nginx.conf /etc/nginx/sites-available/admin-crud
sudo ln -s /etc/nginx/sites-available/admin-crud /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl reload nginx
```

## 🚀 Ejecución

### Modo Desarrollo

#### 1. Iniciar MySQL
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql  # o sudo service mysql start
```

#### 2. Iniciar Backend API
```bash
cd backend
npm run dev
```

El backend estará disponible en `http://localhost:3000`

API Health Check: `http://localhost:3000/api`

#### 3. Iniciar Frontend Angular
```bash
# En otra terminal, desde el directorio raíz
npm start
```

El frontend estará disponible en `http://localhost:4200`

### Modo Producción

#### 1. Construir el Frontend
```bash
npm run build
```

Los archivos compilados estarán en `dist/admin-crud/browser/`

#### 2. Compilar el Backend
```bash
cd backend
npm run build
```

#### 3. Configurar Nginx

Copiar el archivo de configuración y los archivos estáticos:

```bash
# Linux/Mac
sudo cp nginx/nginx.conf /etc/nginx/sites-available/admin-crud
sudo ln -s /etc/nginx/sites-available/admin-crud /etc/nginx/sites-enabled/
sudo cp -r dist/admin-crud/browser/* /usr/share/nginx/html/

# Windows
# Copiar manualmente los archivos según tu instalación de Nginx
```

#### 4. Iniciar servicios

```bash
# Backend en modo producción
cd backend
npm start

# Nginx
sudo systemctl start nginx  # Linux
# o iniciar manualmente en Windows
```

Acceder a la aplicación en `http://localhost`

## 📡 API Endpoints

### Base URL
- **Desarrollo**: `http://localhost:3000/api`
- **Producción**: `http://your-domain.com/api`

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/administradores` | Obtener todos los administradores |
| GET | `/administradores/:id` | Obtener un administrador por ID |
| GET | `/administradores/trabajador/:noTrabajador` | Buscar por número de trabajador |
| POST | `/administradores` | Crear nuevo administrador |
| PUT | `/administradores/:id` | Actualizar administrador |
| DELETE | `/administradores/:id` | Eliminar administrador |

### Ejemplo de Request (POST)

```bash
curl -X POST http://localhost:3000/api/administradores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "noTrabajador": "201",
    "correo": "juan.perez@ejemplo.com",
    "contrasena": "password123"
  }'
```

### Ejemplo de Response

```json
{
  "id": 7,
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "noTrabajador": "201",
  "correo": "juan.perez@ejemplo.com",
  "createdAt": "2025-11-23T19:42:00.000Z",
  "updatedAt": "2025-11-23T19:42:00.000Z"
}
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
admin-crud/
├── backend/                    # API Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts    # Configuración MySQL
│   │   ├── controllers/
│   │   │   └── administradores.controller.ts
│   │   ├── models/
│   │   │   └── administrador.model.ts
│   │   ├── routes/
│   │   │   └── administradores.routes.ts
│   │   └── server.ts          # Servidor Express
│   ├── .env                   # Variables de entorno
│   ├── package.json
│   └── tsconfig.json
│
├── src/                        # Frontend Angular
│   ├── app/
│   │   ├── administradores/
│   │   │   ├── administradores.ts
│   │   │   ├── administradores.html
│   │   │   └── administradores.css
│   │   └── services/
│   │       └── administradores.service.ts
│   └── ...
│
├── nginx/
│   └── nginx.conf             # Configuración Nginx
│
├── package.json
└── README.md
```

### Scripts Disponibles

**Backend:**
```bash
npm run dev      # Modo desarrollo con auto-reload
npm run build    # Compilar TypeScript
npm start        # Iniciar en modo producción
```

**Frontend:**
```bash
npm start        # Servidor de desarrollo (ng serve)
npm run build    # Compilar para producción
npm test         # Ejecutar tests
```

## 🔐 Seguridad

- Las contraseñas se hashean con `bcrypt` antes de almacenarse
- Validación de datos en el backend
- Headers de seguridad en Nginx
- Manejo de errores sin exponer información sensible
- CORS configurado adecuadamente

## 🐛 Solución de Problemas

### Error: "Cannot connect to MySQL"
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos existe

### Error: "CORS policy"
- Verificar `CORS_ORIGIN` en `.env`
- Verificar configuración de proxy en development

### Error: "Port 3000 already in use"
- Cambiar `PORT` en `.env`
- O matar el proceso: `kill -9 $(lsof -t -i:3000)`

## 📝 Licencia

ISC

## 👥 Autor

Admin CRUD Team

---

**Nota**: Este README asume que no estás usando Docker. Si decides usar Docker en el futuro, consulta la documentación de Docker Compose para facilitar el despliegue.
