import { membresia } from '../entidades/Membresiaa';
import { GestorMembresia } from '../gestores/GestorMembresia';
import { GestorTipoMembresia } from '../gestores/GestorTipoMembresia';

export class ServicioMembresia {
    private readonly gestorMembresia: GestorMembresia;
    private readonly gestorTipoMembresia: GestorTipoMembresia;

    constructor(gestorMembresia: GestorMembresia, gestorTipoMembresia: GestorTipoMembresia) {
        this.gestorMembresia = gestorMembresia;
        this.gestorTipoMembresia = gestorTipoMembresia;
    }

    public crear(tipoMembresiaID: number, usuarioID: number): number {
        // Validaciones básicas
        if (!tipoMembresiaID || tipoMembresiaID <= 0) {
            throw new Error('El ID del tipo de membresía es inválido.');
        }
        
        if (!usuarioID || usuarioID <= 0) {
            throw new Error('El ID del usuario es inválido.');
        }

        const tipoMembresia = this.gestorTipoMembresia.buscarPorId(tipoMembresiaID);
        if (!tipoMembresia) {
            throw new Error('Tipo de membresía no encontrado.');
        }

        const fechaInicio = new Date();
        const fechaVencimiento = this.calcularFechaVencimiento(fechaInicio, tipoMembresia);

        const nuevaMembresia = new membresia(tipoMembresiaID, usuarioID, undefined, fechaInicio, fechaVencimiento);
        
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

    private calcularFechaVencimiento(fechaInicio: Date, tipoMembresia: any): Date {
        const fechaVencimiento = new Date(fechaInicio);
        
        // Obtener duración del tipo de membresía
        const duracionValor = tipoMembresia.getDuracionValor();
        const duracionTipo = tipoMembresia.getDuracionTipo();

        // Calcular fecha de vencimiento según el tipo de duración
        switch (duracionTipo) {
            case 'dias':
                fechaVencimiento.setDate(fechaVencimiento.getDate() + duracionValor);
                break;
            case 'semanas':
                fechaVencimiento.setDate(fechaVencimiento.getDate() + (duracionValor * 7));
                break;
            case 'meses':
                fechaVencimiento.setMonth(fechaVencimiento.getMonth() + duracionValor);
                break;
            case 'anual':
                fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + duracionValor);
                break;
            default:
                throw new Error(`Tipo de duración no soportado: ${duracionTipo}`);
        }

        return fechaVencimiento;
    }

    public obtenerMembresiasActivas(usuarioId?: number): membresia[] {
        if (usuarioId) {
            // Si se proporciona usuarioId, devolver solo sus membresías activas
            const membresias = this.buscarPorUsuario(usuarioId);
            return membresias.filter(memb => memb.estaActiva());
        } else {
            // Si no se proporciona usuarioId, devolver todas las membresías activas
            const todasMembresias = this.obtenerTodos();
            return todasMembresias.filter(memb => memb.estaActiva());
        }
    }

    public obtenerMembresiasProximasAVencer(usuarioId?: number): membresia[] {
        const membresias = usuarioId 
            ? this.buscarPorUsuario(usuarioId) 
            : this.obtenerTodos();
        
        return membresias.filter(memb => memb.estaProximaAVencer());
    }

    public obtenerMembresiasVencidas(usuarioId?: number): membresia[] {
        const membresias = usuarioId 
            ? this.buscarPorUsuario(usuarioId) 
            : this.obtenerTodos();
        
        return membresias.filter(memb => memb.estaVencida());
    }

    public tieneMembresiaActiva(usuarioId: number): boolean {
        const membresiasActivas = this.obtenerMembresiasActivas(usuarioId);
        return membresiasActivas.length > 0;
    }

    public renovar(membresiaId: number, nuevoTipoMembresiaID?: number): number {
        const membresiaExistente = this.buscarPorId(membresiaId);
        const tipoMembresiaID = nuevoTipoMembresiaID || membresiaExistente.getTipoMembresiaID();
        
        // Crear nueva membresía con la fecha actual
        return this.crear(tipoMembresiaID, membresiaExistente.getUsuarioID());
    }


}