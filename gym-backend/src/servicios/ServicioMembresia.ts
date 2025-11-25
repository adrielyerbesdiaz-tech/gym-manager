import { membresia } from '../entidades/membresia';
import { GestorMembresia } from '../gestores/GestorMembresia';

export class ServicioMembresia {
    private readonly gestorMembresia: GestorMembresia;

    constructor(gestorMembresia: GestorMembresia) {
        this.gestorMembresia = gestorMembresia;
    }

    public crear(tipoMembresiaID: number, usuarioID: number): number {
        // Validaciones básicas
        if (!tipoMembresiaID || tipoMembresiaID <= 0) {
            throw new Error('El ID del tipo de membresía es inválido.');
        }
        
        if (!usuarioID || usuarioID <= 0) {
            throw new Error('El ID del usuario es inválido.');
        }

        // Aquí podrías agregar lógica extra para verificar si el usuario 
        // ya tiene una membresía activa si tuvieras acceso a otros gestores.

        const nuevaMembresia = new membresia(tipoMembresiaID, usuarioID);
        
        return this.gestorMembresia.agregar(nuevaMembresia);
    }

    public obtenerTodos(): membresia[] {
        return this.gestorMembresia.obtenerTodos();
    }

    public buscarPorId(id: number): membresia {
        const resultado = this.gestorMembresia.buscarPorId(id);
        if (!resultado) {
            throw new Error('Membresía no encontrada.');
        }
        return resultado;
    }

    public buscarPorUsuario(usuarioId: number): membresia[] {
        if (!usuarioId || usuarioId <= 0) return [];
        return this.gestorMembresia.buscarPorUsuarioId(usuarioId);
    }

    public eliminar(id: number): void {
        const existe = this.gestorMembresia.buscarPorId(id);
        if (!existe) {
            throw new Error('Membresía no encontrada.');
        }
        
        const eliminado = this.gestorMembresia.eliminar(id);
        if (!eliminado) {
            throw new Error('Error al eliminar la membresía.');
        }
    }
}