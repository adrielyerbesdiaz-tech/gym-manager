import { equipoAccessorio } from "../entities/equipoAccesorio";

export interface IGestorAccesorioEquipo {
    guardar(accesorio: equipoAccessorio): void;
    actualizar(accesorio: equipoAccessorio): void;
    obtenerPorId(id: number): equipoAccessorio | null;
}