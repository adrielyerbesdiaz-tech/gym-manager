import { equipamientoAccessorio } from '../entidades/equipamientoAccesorio';
import { GestorEquipamientoAccesorio } from '../gestores/GestorEquipamientoAccesorio';

export class ServicioEquipamientoAccesorio {
    private readonly gestorAccesorio: GestorEquipamientoAccesorio;

    constructor(gestorAccesorio: GestorEquipamientoAccesorio) {
        this.gestorAccesorio = gestorAccesorio;
    }

    public crear(equipoId: number, nombre: string, notas?: string): number {
        // Validaciones
        if (!equipoId || equipoId <= 0) {
            throw new Error('El ID del equipo es obligatorio y debe ser positivo.');
        }
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre del accesorio es obligatorio.');
        }

        // Nota: Idealmente aquí se verificaría que el equipoId exista en la tabla Equipamiento.

        const nuevoAccesorio = new equipamientoAccessorio(
            equipoId,
            nombre.trim(),
            notas?.trim()
        );

        return this.gestorAccesorio.agregar(nuevoAccesorio);
    }

    public obtenerTodos(): equipamientoAccessorio[] {
        return this.gestorAccesorio.obtenerTodos();
    }

    public buscarPorId(id: number): equipamientoAccessorio {
        const accesorio = this.gestorAccesorio.buscarPorId(id);
        if (!accesorio) {
            throw new Error('Accesorio de equipamiento no encontrado.');
        }
        return accesorio;
    }

    public buscarPorEquipo(equipoId: number): equipamientoAccessorio[] {
        if (!equipoId || equipoId <= 0) return [];
        return this.gestorAccesorio.buscarPorEquipoId(equipoId);
    }
    
    public actualizarNotas(id: number, notas: string): void {
        const accesorioExistente = this.gestorAccesorio.buscarPorId(id);
        if (!accesorioExistente) {
            throw new Error('Accesorio de equipamiento no encontrado.');
        }

        const actualizado = this.gestorAccesorio.actualizarNotas(id, notas.trim());

        if (!actualizado) {
            throw new Error('Error al actualizar las notas del accesorio.');
        }
    }

    public eliminar(id: number): void {
        const accesorio = this.gestorAccesorio.buscarPorId(id);
        if (!accesorio) {
            throw new Error('Accesorio de equipamiento no encontrado.');
        }
        
        const eliminado = this.gestorAccesorio.eliminar(id);
        if (!eliminado) {
            throw new Error('Error al eliminar el accesorio.');
        }
    }
}