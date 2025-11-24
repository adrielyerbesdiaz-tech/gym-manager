export class mantenimiento {
    private readonly mantenimientoId: number;
    private readonly equipoID: number;
    private descripcion: string;
    private readonly fechaInicio: Date;
    private fechaFin: Date | null;
    private costo: number;

    // Corrección: El constructor ahora acepta el ID del equipo y la descripción
    constructor(equipoID: number, descripcion: string) {
        this.mantenimientoId = 0;
        this.equipoID = equipoID;
        this.descripcion = descripcion;
        this.fechaInicio = new Date(); // Se marca el inicio al instanciar
        this.fechaFin = null;
        this.costo = 0;
    }

    public getMantenimientoId(): number {
        return this.mantenimientoId;
    }

    public getEquipoID(): number {
        return this.equipoID;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public getFechaInicio(): Date {
        return this.fechaInicio;
    }

    public getFechaFin(): Date | null {
        return this.fechaFin;
    }

    public getCosto(): number {
        return this.costo;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public setFechaFin(fechaFin: Date): void {
        this.fechaFin = fechaFin;
    }

    public setCosto(costo: number): void {
        this.costo = costo;
    }
}