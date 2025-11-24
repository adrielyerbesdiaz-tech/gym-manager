import { asistencia } from '../entities/asistencia';
import { ServicioMembresia } from './servicioMembresia';

export interface IGestorAsistencia {
    guardar(asistencia: asistencia): void;
    obtenerPorIdMembresia(idMembresia: number): asistencia[];
}

export class ServicioAsistencia {
    private readonly gestorAsistencia: IGestorAsistencia;
    private readonly servicioMembresia: ServicioMembresia;

    constructor(
        gestorAsistencia: IGestorAsistencia,
        servicioMembresia: ServicioMembresia
    ) {
        this.gestorAsistencia = gestorAsistencia;
        this.servicioMembresia = servicioMembresia;
    }

    public registrarAsistencia(usuarioId: number): void {
        const membresias = this.servicioMembresia.obtenerMembresiasPorUsuario(usuarioId);
        
        if (!membresias || membresias.length === 0) {
            return;
        }

        const ultimaMembresia = membresias[membresias.length - 1];
        const nuevaAsistencia = new asistencia(ultimaMembresia.getMembresiaId());
        
        this.gestorAsistencia.guardar(nuevaAsistencia);
    }

    public obtenerHistorialAsistencia(usuarioId: number): asistencia[] {
        if (usuarioId <= 0) {
            return [];
        }

        const membresiasUsuario = this.servicioMembresia.obtenerMembresiasPorUsuario(usuarioId);
        let historialCompleto: asistencia[] = [];

        for (const membresia of membresiasUsuario) {
            const asistenciasMembresia = this.gestorAsistencia.obtenerPorIdMembresia(membresia.getMembresiaId());
            historialCompleto = historialCompleto.concat(asistenciasMembresia);
        }

        return historialCompleto;
    }
}