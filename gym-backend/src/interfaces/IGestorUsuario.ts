import { usuario } from "../entities/usuario";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorUsuario extends IBaseGestor<usuario> {
    buscarPorNombreUsuario(nombreUsuario: string): usuario | null;
    buscarPorEmail(email: string): usuario | null;
}