import { tipoMembresia } from "../entities/tipoMembresia";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorTipoMembresia extends IBaseGestor<tipoMembresia> {
    // No necesita métodos extra por el momento
}