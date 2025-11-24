import { asistencia } from "../entities/asistencia";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorAsistencia extends IBaseGestor<asistencia> {
    obtenerPorIdMembresia(idMembresia: number): asistencia[];
}