import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, initializeDatabase } from './config/database';
import administradoresRoutes from './routes/administradores.routes';

// Cargar variables de entorno
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares
 */
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Rutas
 */
app.get('/api', (req: Request, res: Response) => {
    res.json({
        message: 'API de Administradores - Admin CRUD',
        version: '1.0.0',
        endpoints: {
            administradores: '/api/administradores'
        }
    });
});

app.use('/api/administradores', administradoresRoutes);

/**
 * Manejo de rutas no encontradas
 */
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

/**
 * Inicialización del servidor
 */
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        await testConnection();

        // Inicializar tablas
        await initializeDatabase();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📚 API disponible en http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
