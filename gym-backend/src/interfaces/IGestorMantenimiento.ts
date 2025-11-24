import { mantenimiento } from "../entities/mantenimiento";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorMantenimiento extends IBaseGestor<mantenimiento> {
    obtenerPorEquipoId(equipoId: number): mantenimiento[];
}