export class cliente {
    private readonly clienteId: number;
    private readonly nombreCompleto: string;
    private readonly telefono: string; // Cambio: number -> string
    private notas: string;
    private readonly fechaRegistro: Date;

    constructor(
        nombreCompleto: string, 
        telefono: string, // El constructor ahora acepta string
        notas: string = '', 
        clienteId: number = 0, 
        fechaRegistro?: Date
    ) {
        this.clienteId = clienteId;
        this.nombreCompleto = nombreCompleto;
        this.telefono = telefono;
        this.notas = notas;
        this.fechaRegistro = fechaRegistro || new Date();
    }

    public getClienteId(): number {
        return this.clienteId;
    }

    public getNombreCompleto(): string {    
        return this.nombreCompleto;
    }

    // Actualizamos el getter para que devuelva string
    public getTelefono(): string {
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