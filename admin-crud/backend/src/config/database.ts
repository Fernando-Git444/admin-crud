import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Pool de conexiones a MySQL
 * Utiliza variables de entorno para la configuración
 */
export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'admin_crud',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Función para verificar la conexión a la base de datos
 */
export const testConnection = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error);
        throw error;
    }
};

/**
 * Script de inicialización de la base de datos
 * Crea la tabla administradores si no existe
 */
export const initializeDatabase = async (): Promise<void> => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS administradores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellidoPaterno VARCHAR(100) NOT NULL DEFAULT '',
        apellidoMaterno VARCHAR(100) NOT NULL DEFAULT '',
        noTrabajador VARCHAR(50) NOT NULL UNIQUE,
        correo VARCHAR(150) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_noTrabajador (noTrabajador),
        INDEX idx_correo (correo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        console.log('✅ Tabla "administradores" verificada/creada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
};
