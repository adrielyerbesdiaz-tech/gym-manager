
export class equipamientoAccessorio{
    public readonly accesorioId: number;
    public readonly equipoId: number;
    public readonly nombre: string;
    public readonly notas: string;

    constructor(equipoId: number, nombre: string, notas?: string){
        this.accesorioId = 0;
        this.equipoId = equipoId;
        this.nombre = nombre;
        this.notas = notas || '';
    }

    getAccesorioId(): number {
        return this.accesorioId;
    }

    getEquipoId(): number {
        return this.equipoId;
    }

    getNombre(): string {
        return this.nombre;
    }

    getNotas(): string {
        return this.notas;
    }
    
}