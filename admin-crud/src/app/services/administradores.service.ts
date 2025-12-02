import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Administrador } from '../administradores/administradores';

/**
 * Servicio para gestionar las operaciones CRUD de administradores
 * Consume la API REST del backend
 */
@Injectable({
    providedIn: 'root'
})
export class AdministradoresService {
    private apiUrl = 'http://localhost:3000/api/administradores';

    constructor(private http: HttpClient) { }

    /**
     * Obtiene todos los administradores
     */
    getAll(): Observable<Administrador[]> {
        return this.http.get<Administrador[]>(this.apiUrl)
            .pipe(catchError(this.handleError));
    }

    /**
     * Obtiene un administrador por ID
     */
    getById(id: number): Observable<Administrador> {
        return this.http.get<Administrador>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Busca un administrador por número de trabajador
     */
    getByNoTrabajador(noTrabajador: string): Observable<Administrador> {
        return this.http.get<Administrador>(`${this.apiUrl}/trabajador/${noTrabajador}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Crea un nuevo administrador
     */
    create(administrador: Omit<Administrador, 'id'>): Observable<Administrador> {
        return this.http.post<Administrador>(this.apiUrl, administrador)
            .pipe(catchError(this.handleError));
    }

    /**
     * Actualiza un administrador existente
     */
    update(id: number, administrador: Partial<Administrador>): Observable<Administrador> {
        return this.http.put<Administrador>(`${this.apiUrl}/${id}`, administrador)
            .pipe(catchError(this.handleError));
    }

    /**
     * Elimina un administrador
     */
    delete(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Manejo centralizado de errores
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del backend
            if (error.error && error.error.error) {
                errorMessage = error.error.error;
            } else {
                errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
            }
        }

        console.error('Error en el servicio:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
