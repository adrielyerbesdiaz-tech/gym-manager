import { equipamiento } from "../entities/equipamiento";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorEquipo extends IBaseGestor<equipamiento> {
    // Aquí podrías añadir buscarPorTipo(tipo: string) en el futuro
}