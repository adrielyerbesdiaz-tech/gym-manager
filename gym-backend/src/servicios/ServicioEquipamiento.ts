import { equipamiento } from '../entidades/equipamiento';
import { GestorEquipamiento } from '../gestores/GestorEquipamiento';

export class ServicioEquipamiento {
    private readonly gestorEquipamiento: GestorEquipamiento;

    constructor(gestorEquipamiento: GestorEquipamiento) {
        this.gestorEquipamiento = gestorEquipamiento;
    }

    public crear(nombre: string, tipo: string, imagenUrl?: string, descripcion?: string): number {
        // Validaciones
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre del equipamiento es obligatorio.');
        }
        if (!tipo || tipo.trim() === '') {
            throw new Error('El tipo de equipamiento es obligatorio.');
        }

        const nuevoEquipo = new equipamiento(
            nombre.trim(),
            tipo.trim(),
            imagenUrl?.trim(),
            descripcion?.trim()
        );

        return this.gestorEquipamiento.agregar(nuevoEquipo);
    }

    public obtenerTodos(): equipamiento[] {
        return this.gestorEquipamiento.obtenerTodos();
    }

    public buscar(criterio: number | string): equipamiento[] {
        if (typeof criterio === 'number') {
            const equipo = this.gestorEquipamiento.buscarPorId(criterio);
            return equipo ? [equipo] : [];
        }
        
        // Si es string, buscamos por nombre
        return this.gestorEquipamiento.buscarPorNombre(criterio.trim());
    }

    public obtenerPorTipo(tipo: string): equipamiento[] {
        if (!tipo || tipo.trim() === '') return [];
        return this.gestorEquipamiento.buscarPorTipo(tipo.trim());
    }

    public actualizar(id: number, nombre: string, tipo: string, imagenUrl?: string, descripcion?: string): void {
        const equipoExistente = this.gestorEquipamiento.buscarPorId(id);
        if (!equipoExistente) {
            throw new Error('Equipamiento no encontrado.');
        }

        if (!nombre || nombre.trim() === '') throw new Error('El nombre es obligatorio');
        if (!tipo || tipo.trim() === '') throw new Error('El tipo es obligatorio');

        const actualizado = this.gestorEquipamiento.actualizar(
            id, 
            nombre.trim(), 
            tipo.trim(), 
            imagenUrl?.trim(), 
            descripcion?.trim()
        );

        if (!actualizado) {
            throw new Error('Error al actualizar el equipamiento.');
        }
    }

    public eliminar(id: number): void {
        const equipo = this.gestorEquipamiento.buscarPorId(id);
        if (!equipo) {
            throw new Error('Equipamiento no encontrado.');
        }
        
        const eliminado = this.gestorEquipamiento.eliminar(id);
        if (!eliminado) {
            throw new Error('Error al eliminar el equipamiento.');
        }
    }
}