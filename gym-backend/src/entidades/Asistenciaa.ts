
export class asistencia{
    private asistenciaId: number;
    private clienteID: number;
    private fechaCheckIn: Date;

    // Opción: Agregar constructor con todos los parámetros
    constructor(clienteID: number, asistenciaId?: number, fechaCheckIn?: Date) {
        this.asistenciaId = asistenciaId || 0;
        this.fechaCheckIn = fechaCheckIn || new Date();
        this.clienteID = clienteID;
    }

    public getAsistenciaId(): number {
        return this.asistenciaId;
    }

    public getClienteID(): number {
        return this.clienteID;
    }

    public getFechaCheckIn(): Date {
        return this.fechaCheckIn;
    }

}