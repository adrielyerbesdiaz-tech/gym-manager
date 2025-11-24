import { mantenimiento } from "../entities/mantenimiento";

export interface IGestorMantenimiento {
    guardar(mantenimiento: mantenimiento): void;
    actualizar(mantenimiento: mantenimiento): void;
    obtenerPorId(id: number): mantenimiento | null;
    obtenerPorEquipoId(equipoId: number): mantenimiento[];
}