import { mantenimiento } from '../entidades/Mantenimiento';
import { GestorMantenimiento } from '../gestores/GestorMantenimiento';

export class ServicioMantenimiento {
    private readonly gestorMantenimiento: GestorMantenimiento;

    constructor(gestorMantenimiento: GestorMantenimiento) {
        this.gestorMantenimiento = gestorMantenimiento;
    }

    public crear(idEquipamiento: number, descripcion: string, fechaMantenimiento?: Date): number {
        if (!idEquipamiento) {
            throw new Error('El ID del equipamiento es obligatorio.');
        }

        if (!descripcion || descripcion.trim() === '') {
            throw new Error('La descripción del mantenimiento es obligatoria.');
        }

        const nuevoMantenimiento = new mantenimiento(
            idEquipamiento,
            undefined, // mantenimientoId se generará automáticamente
            fechaMantenimiento,
            descripcion.trim()
        );
        
        return this.gestorMantenimiento.agregar(nuevoMantenimiento);
    }

    public obtenerTodos(): mantenimiento[] {
        return this.gestorMantenimiento.obtenerTodos();
    }

    public buscar(criterio: number | string): mantenimiento[] {
        return this.gestorMantenimiento.buscar(criterio);
    }

    public buscarPorEquipo(idEquipamiento: number): mantenimiento[] {
        return this.gestorMantenimiento.buscarPorEquipo(idEquipamiento);
    }

    public actualizar(id: number, idEquipamiento: number, fechaMantenimiento: Date, descripcion: string): void {
        if (!idEquipamiento) {
            throw new Error('El ID del equipamiento es obligatorio.');
        }

        if (!descripcion || descripcion.trim() === '') {
            throw new Error('La descripción del mantenimiento es obligatoria.');
        }

        const actualizado = this.gestorMantenimiento.actualizarMantenimiento(
            id, 
            idEquipamiento, 
            fechaMantenimiento, 
            descripcion.trim()
        );

        if (!actualizado) {
            throw new Error('Mantenimiento no encontrado o error al actualizar.');
        }
    }

    public eliminar(id: number): void {
        const eliminado = this.gestorMantenimiento.eliminar(id);
        if (!eliminado) {
            throw new Error('Mantenimiento no encontrado o error al eliminar.');
        }
    }

    // Método adicional para obtener mantenimiento por ID específico
    public obtenerPorId(id: number): mantenimiento | null {
        return this.gestorMantenimiento.buscarPorId(id);
    }
}