
export class membresia{
    private readonly membresiaId: number;
    private readonly tipoMembresiaID: number;
    private readonly usuarioID: number;
    private readonly fechaInicio: Date;

    constructor(tipoMembresiaID: number, usuarioID: number){
        this.membresiaId = 0;
        this.tipoMembresiaID = tipoMembresiaID;
        this.usuarioID = usuarioID;
        this.fechaInicio = new Date();
    }

    public getMembresiaId(): number {
        return this.membresiaId;
    }
    
    public getTipoMembresiaID(): number {
        return this.tipoMembresiaID;
    }

    public getUsuarioID(): number {
        return this.usuarioID;
    }

    public getFechaInicio(): Date {
        return this.fechaInicio;
    }

}