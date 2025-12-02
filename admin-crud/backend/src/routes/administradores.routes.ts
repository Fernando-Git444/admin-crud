import { Router } from 'express';
import {
    getAllAdministradores,
    getAdministradorById,
    getAdministradorByNoTrabajador,
    createAdministrador,
    updateAdministrador,
    deleteAdministrador
} from '../controllers/administradores.controller';

const router = Router();

/**
 * Rutas para el recurso Administradores
 */

// GET /api/administradores - Obtener todos los administradores
router.get('/', getAllAdministradores);

// GET /api/administradores/:id - Obtener un administrador por ID
router.get('/:id(\\d+)', getAdministradorById);

// GET /api/administradores/trabajador/:noTrabajador - Buscar por número de trabajador
router.get('/trabajador/:noTrabajador', getAdministradorByNoTrabajador);

// POST /api/administradores - Crear un nuevo administrador
router.post('/', createAdministrador);

// PUT /api/administradores/:id - Actualizar un administrador
router.put('/:id', updateAdministrador);

// DELETE /api/administradores/:id - Eliminar un administrador
router.delete('/:id', deleteAdministrador);

export default router;
