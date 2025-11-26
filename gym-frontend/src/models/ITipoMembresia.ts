export interface ITipoMembresia {
    tipoMembresiaID: number;
    nombre: string;
    duracionValor: number;
    duracionTipo: string;
    precio: number;
    // Calculated property for frontend convenience, might need to be computed manually if not from backend
    duracionDias?: number;
}