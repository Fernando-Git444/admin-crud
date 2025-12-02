/**
 * Interface que define la estructura de un Administrador
 */
export interface Administrador {
    id?: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    noTrabajador: string;
    correo: string;
    contrasena: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * DTO para crear un nuevo administrador
 * No incluye el id ya que se genera automáticamente
 */
export interface CreateAdministradorDTO {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    noTrabajador: string;
    correo: string;
    contrasena: string;
}

/**
 * DTO para actualizar un administrador existente
 * Todos los campos son opcionales
 */
export interface UpdateAdministradorDTO {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    noTrabajador?: string;
    correo?: string;
    contrasena?: string;
}
