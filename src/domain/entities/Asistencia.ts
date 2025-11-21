
export class asistencia{
    private readonly asistenciaId: number;
    private readonly membresiaID: number;
    private readonly fechaCheckIn: Date;

    constructor(membresiaID: number){
        this.asistenciaId = 0;
        this.fechaCheckIn = new Date();
        this.membresiaID = membresiaID;
    }

    public getAsistenciaId(): number {
        return this.asistenciaId;
    }

    public getMembresiaID(): number {
        return this.membresiaID;
    }

    public getFechaCheckIn(): Date {
        return this.fechaCheckIn;
    }

}