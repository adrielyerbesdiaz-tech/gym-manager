import { tipoMembresia } from "../entities/tipoMembresia";

export interface IGestorTipoMembresia {
    obtenerPorId(id: number): tipoMembresia | null;
    guardar(tipo: tipoMembresia): void;
    actualizar(tipo: tipoMembresia): void;
    obtenerTodos(): tipoMembresia[];
}