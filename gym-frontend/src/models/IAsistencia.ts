export interface IAsistencia {
    asistenciaId: number;
    clienteId: number;
    fechaCheckIn: string;
    fechaRegistro?: string;
    // Campos opcionales para compatibilidad
    membresiaId?: number;
    tipoMembresiaId?: number;
    fechaInicio?: string;
    fechaVencimiento: string;
    estado?: string;
}