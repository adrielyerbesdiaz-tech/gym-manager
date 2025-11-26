import { cliente } from "../entidades/Cliente"

export interface IServicios {
        crear(): number;
        actualizar(cliente: cliente): number;
        eliminar(id: number | string): number;
        buscar(value: number | null): cliente | null;
        obtenerTodos(): cliente[];
}