
export class membresia{
    private readonly membresiaId: number;
    private readonly tipoMembresiaID: number;
    private readonly usuarioID: number;
    private readonly fechaInicio: Date;
    private readonly FechaVencimiento: Date;

    constructor(tipoMembresiaID: number, usuarioID: number, membresiaId?: number, fechaInicio?: Date, FechaVencimiento?: Date){
        this.membresiaId = membresiaId || 0;
        this.tipoMembresiaID = tipoMembresiaID;
        this.usuarioID = usuarioID;
        this.fechaInicio = fechaInicio || new Date();
        this.FechaVencimiento = FechaVencimiento || new Date();
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

    public getFechaVencimiento(): Date {
        return this.FechaVencimiento;
    }

    public estaActiva(): boolean {
        return new Date() <= this.FechaVencimiento;
    }

    public estaProximaAVencer(): boolean {
        const hoy = new Date();
        const diferenciaMs = this.FechaVencimiento.getTime() - hoy.getTime();
        const diferenciaDias = diferenciaMs / (1000 * 60 * 60 * 24);
        return diferenciaDias <= 7 && diferenciaDias > 0;
    }

    public estaVencida(): boolean {
        return new Date() > this.FechaVencimiento;
    }


}