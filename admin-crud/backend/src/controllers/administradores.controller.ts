import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { Administrador } from '../models/administrador.model';

/**
 * Obtiene todos los administradores
 */
export const getAllAdministradores = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, createdAt, updatedAt FROM administradores ORDER BY id DESC'
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({ error: 'Error al obtener administradores' });
    }
};

/**
 * Obtiene un administrador por ID
 */
export const getAdministradorById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, createdAt, updatedAt FROM administradores WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: 'Administrador no encontrado' });
            return;
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener administrador:', error);
        res.status(500).json({ error: 'Error al obtener administrador' });
    }
};

/**
 * Busca administradores por número de trabajador
 */
export const getAdministradorByNoTrabajador = async (req: Request, res: Response): Promise<void> => {
    try {
        const { noTrabajador } = req.params;

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, createdAt, updatedAt FROM administradores WHERE noTrabajador = ?',
            [noTrabajador]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: 'Administrador no encontrado' });
            return;
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al buscar administrador:', error);
        res.status(500).json({ error: 'Error al buscar administrador' });
    }
};

/**
 * Crea un nuevo administrador
 */
export const createAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, contrasena } = req.body;

        // Validar campos requeridos
        if (!nombre || !noTrabajador || !correo || !contrasena) {
            res.status(400).json({ error: 'Faltan campos requeridos: nombre, noTrabajador, correo, contrasena' });
            return;
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            res.status(400).json({ error: 'Formato de correo inválido' });
            return;
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar en la base de datos
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO administradores (nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, contrasena) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellidoPaterno || '', apellidoMaterno || '', noTrabajador, correo, hashedPassword]
        );

        // Obtener el registro creado
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, createdAt, updatedAt FROM administradores WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (error: any) {
        console.error('Error al crear administrador:', error);

        // Manejar errores de duplicados
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('noTrabajador')) {
                res.status(409).json({ error: 'El número de trabajador ya existe' });
            } else if (error.message.includes('correo')) {
                res.status(409).json({ error: 'El correo ya está registrado' });
            } else {
                res.status(409).json({ error: 'Ya existe un registro con esos datos' });
            }
            return;
        }

        res.status(500).json({ error: 'Error al crear administrador' });
    }
};

/**
 * Actualiza un administrador existente
 */
export const updateAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, contrasena } = req.body;

        // Verificar que el administrador existe
        const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM administradores WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            res.status(404).json({ error: 'Administrador no encontrado' });
            return;
        }

        // Construir la consulta de actualización dinámicamente
        const updates: string[] = [];
        const values: any[] = [];

        if (nombre !== undefined) {
            updates.push('nombre = ?');
            values.push(nombre);
        }
        if (apellidoPaterno !== undefined) {
            updates.push('apellidoPaterno = ?');
            values.push(apellidoPaterno);
        }
        if (apellidoMaterno !== undefined) {
            updates.push('apellidoMaterno = ?');
            values.push(apellidoMaterno);
        }
        if (noTrabajador !== undefined) {
            updates.push('noTrabajador = ?');
            values.push(noTrabajador);
        }
        if (correo !== undefined) {
            // Validar formato de correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                res.status(400).json({ error: 'Formato de correo inválido' });
                return;
            }
            updates.push('correo = ?');
            values.push(correo);
        }
        if (contrasena !== undefined) {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            updates.push('contrasena = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
            return;
        }

        values.push(id);

        await pool.query(
            `UPDATE administradores SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Obtener el registro actualizado
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, nombre, apellidoPaterno, apellidoMaterno, noTrabajador, correo, createdAt, updatedAt FROM administradores WHERE id = ?',
            [id]
        );

        res.json(rows[0]);
    } catch (error: any) {
        console.error('Error al actualizar administrador:', error);

        // Manejar errores de duplicados
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('noTrabajador')) {
                res.status(409).json({ error: 'El número de trabajador ya existe' });
            } else if (error.message.includes('correo')) {
                res.status(409).json({ error: 'El correo ya está registrado' });
            } else {
                res.status(409).json({ error: 'Ya existe un registro con esos datos' });
            }
            return;
        }

        res.status(500).json({ error: 'Error al actualizar administrador' });
    }
};

/**
 * Elimina un administrador
 */
export const deleteAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM administradores WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Administrador no encontrado' });
            return;
        }

        res.json({ message: 'Administrador eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar administrador:', error);
        res.status(500).json({ error: 'Error al eliminar administrador' });
    }
};
