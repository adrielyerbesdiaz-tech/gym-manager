import { asistencia } from "../entities/asistencia";

export interface IGestorAsistencia {
    guardar(asistencia: asistencia): void;
    obtenerPorIdMembresia(idMembresia: number): asistencia[];
}