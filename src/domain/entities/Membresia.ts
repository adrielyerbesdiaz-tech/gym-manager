
export class Membresia{
    private readonly membresiaId: number;
    private readonly tipoMembresiaID: number;
    private readonly clienteID: number;
    private readonly fechaInicio: Date;

    constructor(tipoMembresiaID: number, clienteID: number){
        this.membresiaId = 0;
        this.tipoMembresiaID = tipoMembresiaID;
        this.clienteID = clienteID;
        this.fechaInicio = new Date();
    }

    public getMembresiaId(): number {
        return this.membresiaId;
    }
    
    public getTipoMembresiaID(): number {
        return this.tipoMembresiaID;
    }

    public getclienteID(): number {
        return this.clienteID;
    }

    public getFechaInicio(): Date {
        return this.fechaInicio;
    }

}