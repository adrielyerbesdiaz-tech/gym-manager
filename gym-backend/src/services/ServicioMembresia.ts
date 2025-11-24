import { membresia } from '../entities/membresia';
import { pago } from '../entities/pago';
import { tipoMembresia } from '../entities/tipoMembresia';

export interface IGestorMembresia {
    guardar(membresia: membresia): void;
    obtenerPorUsuarioId(usuarioId: number): membresia[];
}

export interface IGestorTipoMembresia {
    obtenerPorId(id: number): tipoMembresia | null;
}

export interface IGestorPago {
    registrar(pago: pago): void;
}

export class ServicioMembresia {
    private readonly gestorMembresia: IGestorMembresia;
    private readonly gestorTipoMembresia: IGestorTipoMembresia;
    private readonly gestorPago: IGestorPago;

    constructor(
        gestorMembresia: IGestorMembresia,
        gestorTipoMembresia: IGestorTipoMembresia,
        gestorPago: IGestorPago
    ) {
        this.gestorMembresia = gestorMembresia;
        this.gestorTipoMembresia = gestorTipoMembresia;
        this.gestorPago = gestorPago;
    }

    public crearMembresia(usuarioId: number, tipoMembresiaId: number): void {
        const tipo = this.gestorTipoMembresia.obtenerPorId(tipoMembresiaId);
        
        if (!tipo) {
            throw new Error('El tipo de membresía no existe.');
        }

        const nuevaMembresia = new membresia(tipoMembresiaId, usuarioId);
        this.gestorMembresia.guardar(nuevaMembresia);

        const nuevoPago = new pago(nuevaMembresia.getMembresiaId(), tipo.getPrecio());
        this.gestorPago.registrar(nuevoPago);
    }

    public renovarMembresia(usuarioId: number, tipoMembresiaId: number): void {
        this.crearMembresia(usuarioId, tipoMembresiaId);
    }

    public obtenerEstadoMembresia(usuarioId: number): string {
        const membresias = this.gestorMembresia.obtenerPorUsuarioId(usuarioId);
        
        if (!membresias || membresias.length === 0) {
            return 'Sin Membresía';
        }

        const ultimaMembresia = membresias[membresias.length - 1];
        const tipo = this.gestorTipoMembresia.obtenerPorId(ultimaMembresia.getTipoMembresiaID());

        if (!tipo) {
            return 'Error de Datos';
        }

        const fechaInicio = ultimaMembresia.getFechaInicio();
        const duracionDias = tipo.getDuracionDias();
        const fechaVencimiento = new Date(fechaInicio.getTime() + duracionDias * 24 * 60 * 60 * 1000);
        const ahora = new Date();

        if (ahora <= fechaVencimiento) {
            return 'Activa';
        }
        
        return 'Vencida';
    }

    public obtenerMembresiasPorUsuario(usuarioId: number): membresia[] {
        return this.gestorMembresia.obtenerPorUsuarioId(usuarioId) || [];
    }
}