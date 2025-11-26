
export class cliente{
    private readonly clienteId: number;
    private readonly nombreCompleto: string;
    private readonly telefono: number;
    private notas: string;
    private readonly fechaRegistro: Date;

    constructor(nombreCompleto: string, telefono: number, notas?: string, clienteId?: number){
        this.clienteId = clienteId || 0;
        this.nombreCompleto = nombreCompleto;
        this.telefono = telefono;
        this.notas = notas || '';
        this.fechaRegistro = new Date();
    }

    public getClienteId(): number {
        return this.clienteId;
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