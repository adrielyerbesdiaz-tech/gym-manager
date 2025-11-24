import { usuario } from "../entities/usuario";

export interface IGestorUsuario {
    guardar(usuario: usuario): void;
    buscarPorNombreUsuario(nombreUsuario: string): usuario | null;
    buscarPorEmail(email: string): usuario | null;
}