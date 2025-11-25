export interface IMantenimiento {
    mantenimientoId: number;
    equipoId: number;
    descripcion: string;
    fechaInicio: string;
    fechaFin?: string | null; // Puede ser nulo si está en curso
    costo: number;
}