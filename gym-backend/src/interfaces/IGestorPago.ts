import { pago } from "../entities/pago";

export interface IGestorPago {
    registrar(pago: pago): void;
}