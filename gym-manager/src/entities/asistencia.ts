
export class asistencia{
    private readonly asistenciaId: number;
    private readonly clienteID: number;
    private readonly fechaCheckIn: Date;

    constructor(clienteID: number){
        this.asistenciaId = 0;
        this.fechaCheckIn = new Date();
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