import type { ITipoMembresia } from "./ITipoMembresia";
import type { ICliente } from "./ICliente";

export interface IMembresia {
    membresiaId: number;
    tipoMembresiaId: number;
    clienteId: number;
    fechaInicio: string;
     fechaVencimiento: string;

    // Propiedades opcionales para cuando el backend envía datos populados (JOINs)
    tipoMembresia?: ITipoMembresia;
    cliente?: ICliente;

    // Estado calculado que podría venir del backend
    estado?: 'Activa' | 'Vencida';
}