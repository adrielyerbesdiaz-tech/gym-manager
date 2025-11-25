
export class cliente{
    private readonly Id: number;
    private readonly nombreCompleto: string;
    private readonly telefono: number;
    private notas: string;
    private readonly fechaRegistro: Date;

    constructor(nombreCompleto: string, telefono: number, notas?: string, Id?: number){
        this.Id = Id || 0;
        this.nombreCompleto = nombreCompleto;
        this.telefono = telefono;
        this.notas = notas || '';
        this.fechaRegistro = new Date();
    }

    public getId(): number {
        return this.Id;
    }
    
    public getNombreCompleto(): string {    
        return this.nombreCompleto;
    }

    public getTelefono(): number {
        return this.telefono;
    }

    public getNotas(): string {
        return this.notas;
    }

    public getFechaRegistro(): Date {
        return this.fechaRegistro;
    }

    public setNotas(notas: string): void {
        this.notas = notas;
    }


}