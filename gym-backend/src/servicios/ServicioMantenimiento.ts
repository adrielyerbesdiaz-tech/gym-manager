import { mantenimiento } from '../entidades/Mantenimientoa';
import { GestorMantenimiento } from '../gestores/GestorMantenimiento';

export class ServicioMantenimiento {
    private readonly gestorMantenimiento: GestorMantenimiento;

    constructor(gestorMantenimiento: GestorMantenimiento) {
        this.gestorMantenimiento = gestorMantenimiento;
    }

    public crear(tipo: string): number {
        if (!tipo || tipo.trim() === '') {
            throw new Error('El tipo de mantenimiento es obligatorio.');
        }

        const nuevoMantenimiento = new mantenimiento(tipo.trim());
        
        return this.gestorMantenimiento.agregar(nuevoMantenimiento);
    }

    public obtenerTodos(): mantenimiento[] {
        return this.gestorMantenimiento.obtenerTodos();
    }

    public buscar(criterio: number | string): mantenimiento[] {
        if (typeof criterio === 'number') {
            const mant = this.gestorMantenimiento.buscarPorId(criterio);
            return mant ? [mant] : [];
        }
        
        // Si es string, buscamos por tipo
        return this.gestorMantenimiento.buscarPorTipo(criterio.trim());
    }

    public eliminar(id: number): void {
        const mant = this.gestorMantenimiento.buscarPorId(id);
        if (!mant) {
            throw new Error('Mantenimiento no encontrado.');
        }
        
        const eliminado = this.gestorMantenimiento.eliminar(id);
        if (!eliminado) {
            throw new Error('Error al eliminar el registro de mantenimiento.');
        }
    }
}