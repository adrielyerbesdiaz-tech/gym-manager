import type { ITipoMembresia } from "./ITipoMembresia";
import type { ICliente } from "./ICliente";

export interface IMembresia {
    membresiaId: number;
    tipoMembresiaID: number;
    usuarioID: number;
    fechaInicio: string;
    FechaVencimiento: string;

    // Propiedades opcionales para cuando el backend envía datos populados (JOINs)
    tipoMembresia?: ITipoMembresia;
    cliente?: ICliente;

    // Estado calculado que podría venir del backend
    estado?: 'Activa' | 'Vencida';
}