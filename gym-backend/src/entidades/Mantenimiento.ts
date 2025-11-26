export class mantenimiento{
    public readonly mantenimientoId: number;
    public readonly idEquipamiento: number;
    public readonly fechaMantenimiento: Date;
    public readonly descripcion: string;

    constructor(idEquipamiento:number,mantenimientoID?: number, fechaMantenimiento?: Date, descripcion?: string){
        this.mantenimientoId = mantenimientoID || 0;
        this.idEquipamiento = idEquipamiento;
        this.fechaMantenimiento = fechaMantenimiento || new Date();
        this.descripcion = descripcion || '';
    }

    public getMantenimientoId(): number {
        return this.mantenimientoId;
    }

    public getIdEquipamiento(): number {
        return this.idEquipamiento;
    }

    public getFechaMantenimiento(): Date {
        return this.fechaMantenimiento;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }
}
