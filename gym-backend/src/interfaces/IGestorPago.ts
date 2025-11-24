import { pago } from "../entities/pago";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorPago extends IBaseGestor<pago> {
    registrar(pago: pago): void; // Alias para guardar, o método específico
}