export interface ITipoMembresia {
    tipoMembresiaId: number;
    nombre: string;
    duracionValor: number;
    precio: number;
    duracionTipo: 'dias' | 'semanas' | 'meses' | 'anios';
}