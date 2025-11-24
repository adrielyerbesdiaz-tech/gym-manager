import { cliente } from "../entities/cliente";
import { IBaseGestor } from "./IBaseGestor";

export interface IGestorCliente extends IBaseGestor<cliente> {
}