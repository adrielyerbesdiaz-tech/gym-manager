import { membresia } from "../entities/membresia";

export interface IGestorMembresia {
    guardar(membresia: membresia): void;
    obtenerPorUsuarioId(usuarioId: number): membresia[];
}