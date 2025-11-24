import { equipamiento } from "../entities/equipamiento";

export interface IGestorEquipo {
    guardar(equipo: equipamiento): void;
    actualizar(equipo: equipamiento): void;
    eliminar(id: number): void;
    obtenerPorId(id: number): equipamiento | null;
}