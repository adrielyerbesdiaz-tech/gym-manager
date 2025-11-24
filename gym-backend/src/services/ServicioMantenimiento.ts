import { mantenimiento } from '../entities/mantenimiento';
import { equipamiento } from '../entities/equipamiento';

export interface IGestorMantenimiento {
    guardar(mantenimiento: mantenimiento): void;
    actualizar(mantenimiento: mantenimiento): void;
    obtenerPorId(id: number): mantenimiento | null;
    obtenerPorEquipoId(equipoId: number): mantenimiento[];
}

export interface IGestorEquipo {
    obtenerPorId(id: number): equipamiento | null;
}

export class ServicioMantenimiento {
    private readonly gestorMantenimiento: IGestorMantenimiento;
    private readonly gestorEquipo: IGestorEquipo;

    constructor(
        gestorMantenimiento: IGestorMantenimiento,
        gestorEquipo: IGestorEquipo
    ) {
        this.gestorMantenimiento = gestorMantenimiento;
        this.gestorEquipo = gestorEquipo;
    }

    public programarMantenimiento(equipoId: number, descripcion: string): void {
        const equipo = this.gestorEquipo.obtenerPorId(equipoId);

        if (!equipo) {
            throw new Error('No se puede programar mantenimiento: El equipo no existe.');
        }

        const nuevoMantenimiento = new mantenimiento(equipoId, descripcion);
        this.gestorMantenimiento.guardar(nuevoMantenimiento);
    }

    public finalizarMantenimiento(mantenimientoId: number, costo: number, notasFinales: string): void {
        const mantenimientoExistente = this.gestorMantenimiento.obtenerPorId(mantenimientoId);

        if (!mantenimientoExistente) {
            throw new Error('No se puede finalizar: El mantenimiento no existe.');
        }

        if (mantenimientoExistente.getFechaFin() !== null) {
            throw new Error('El mantenimiento ya ha sido finalizado previamente.');
        }

        if (costo < 0) {
            throw new Error('El costo del mantenimiento no puede ser negativo.');
        }

        mantenimientoExistente.setFechaFin(new Date());
        mantenimientoExistente.setCosto(costo);
        mantenimientoExistente.setDescripcion(`${mantenimientoExistente.getDescripcion()} - Notas Cierre: ${notasFinales}`);

        this.gestorMantenimiento.actualizar(mantenimientoExistente);
    }
}