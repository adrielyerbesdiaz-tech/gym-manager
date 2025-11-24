import { equipoAccessorio } from "../entities/equipoAccesorio";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorAccesorioEquipo extends IBaseGestor<equipoAccessorio> {
    // Cuerpo vacío: hereda todo de IBaseGestor
}