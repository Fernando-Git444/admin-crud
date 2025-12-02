import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradoresService } from '../services/administradores.service';

export interface Administrador {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  noTrabajador: string;
  correo: string;
  contrasena: string;
}

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administradores.html',
  styleUrls: ['./administradores.css', './admin-messages.css']
})
export class AdministradoresComponent implements OnInit {

  // ========== INYECCIÓN DE DEPENDENCIAS ==========

  private administradoresService = inject(AdministradoresService);

  // ========== PROPIEDADES (Variables del componente) ==========

  // Array que almacena todos los administradores
  administradores: Administrador[] = [];

  // Array filtrado que se muestra en la tabla
  administradoresFiltrados: Administrador[] = [];

  // Variable para el término de búsqueda
  terminoBusqueda: string = '';

  // Variable para saber si busca por 'id' o 'noTrabajador'
  buscarPor: string = 'id';

  // Variable para mostrar/ocultar el modal
  mostrarModal: boolean = false;

  // Variable para saber si el modal es para 'agregar' o 'editar'
  modoModal: 'agregar' | 'editar' = 'agregar';

  // Administrador seleccionado para editar
  adminSeleccionado: Administrador | null = null;

  // Objeto que almacena los datos del formulario
  formulario: Administrador = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    noTrabajador: '',
    correo: '',
    contrasena: ''
  };

  // Estados de carga y errores
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // ========== CONSTRUCTOR Y LIFECYCLE HOOKS ==========

  // Se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    this.cargarAdministradores();
  }

  // ========== MÉTODOS (Funciones del componente) ==========

  /**
   * Carga todos los administradores desde la API
   */
  cargarAdministradores(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.administradoresService.getAll().subscribe({
      next: (data) => {
        this.administradores = data;
        this.administradoresFiltrados = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los administradores: ' + error.message;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Filtra los administradores según el término de búsqueda
   */
  buscar(): void {
    this.errorMessage = '';

    // Si no hay término de búsqueda, muestra todos
    if (!this.terminoBusqueda.trim()) {
      this.administradoresFiltrados = [...this.administradores];
      return;
    }

    // Filtra según el criterio seleccionado
    if (this.buscarPor === 'id') {
      this.administradoresFiltrados = this.administradores.filter(admin =>
        admin.id?.toString() === this.terminoBusqueda
      );
    } else {
      this.administradoresFiltrados = this.administradores.filter(admin =>
        admin.noTrabajador === this.terminoBusqueda
      );
    }
  }

  /**
   * Limpia el término de búsqueda y muestra todos los registros
   */
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.administradoresFiltrados = [...this.administradores];
    this.errorMessage = '';
  }

  /**
   * Abre el modal en modo "agregar"
   */
  abrirModalAgregar(): void {
    this.modoModal = 'agregar';
    // Limpia el formulario
    this.formulario = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      noTrabajador: '',
      correo: '',
      contrasena: ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.mostrarModal = true;
  }

  /**
   * Abre el modal en modo "editar"
   * @param admin - Administrador a editar
   */
  abrirModalEditar(admin: Administrador): void {
    this.modoModal = 'editar';
    this.adminSeleccionado = admin;
    // Copia los datos del admin al formulario (sin la contraseña)
    this.formulario = {
      ...admin,
      contrasena: '' // No mostramos la contraseña actual
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.adminSeleccionado = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Guarda los cambios (agregar o editar)
   */
  guardar(): void {
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.modoModal === 'agregar') {
      // MODO AGREGAR: Crea un nuevo administrador
      this.administradoresService.create(this.formulario).subscribe({
        next: (nuevoAdmin) => {
          this.successMessage = 'Administrador creado exitosamente';
          this.isSaving = false;
          this.cargarAdministradores();
          setTimeout(() => this.cerrarModal(), 1000);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.isSaving = false;
        }
      });
    } else {
      // MODO EDITAR: Actualiza el administrador existente
      if (this.adminSeleccionado?.id) {
        // Solo enviar la contraseña si se modificó
        const datosActualizar: Partial<Administrador> = {
          nombre: this.formulario.nombre,
          apellidoPaterno: this.formulario.apellidoPaterno,
          apellidoMaterno: this.formulario.apellidoMaterno,
          noTrabajador: this.formulario.noTrabajador,
          correo: this.formulario.correo
        };

        if (this.formulario.contrasena.trim()) {
          datosActualizar.contrasena = this.formulario.contrasena;
        }

        this.administradoresService.update(this.adminSeleccionado.id, datosActualizar).subscribe({
          next: (adminActualizado) => {
            this.successMessage = 'Administrador actualizado exitosamente';
            this.isSaving = false;
            this.cargarAdministradores();
            setTimeout(() => this.cerrarModal(), 1000);
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.isSaving = false;
          }
        });
      }
    }
  }

  /**
   * Elimina un administrador
   * @param id - ID del administrador a eliminar
   */
  eliminar(id?: number): void {
    if (!id) return;

    // Pide confirmación antes de eliminar
    if (confirm('¿Está seguro de eliminar este administrador?')) {
      this.administradoresService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Administrador eliminado exitosamente';
          this.cargarAdministradores();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar: ' + error.message;
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  /**
   * Genera puntos para ocultar la contraseña
   * @param contrasena - Contraseña a ocultar
   * @returns String con puntos
   */
  ocultarContrasena(contrasena: string): string {
    return '•'.repeat(8); // Mostramos siempre 8 puntos por seguridad
  }
}