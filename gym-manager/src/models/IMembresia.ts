import { ITipoMembresia } from "./ITipoMembresia";
import { ICliente } from "./ICliente";

export interface IMembresia {
    membresiaId: number;
    tipoMembresiaId: number;
    usuarioId: number;
    fechaInicio: string;
    
    // Propiedades opcionales para cuando el backend envía datos populados (JOINs)
    tipoMembresia?: ITipoMembresia;
    cliente?: ICliente;
    
    // Estado calculado que podría venir del backend
    estado?: 'Activa' | 'Vencida';
}