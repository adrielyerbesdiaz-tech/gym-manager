export class mantenimiento{
    public readonly mantenimientoId: number;
    public readonly tipoMantenimiento: string;
    public readonly fechaMantenimiento: Date;

    constructor(tipoMantenimiento: string){
        this.mantenimientoId = 0;
        this.tipoMantenimiento = tipoMantenimiento;
        this.fechaMantenimiento = new Date();
    }
}