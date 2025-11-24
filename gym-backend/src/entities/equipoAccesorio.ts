
export class equipoAccessorio{
    public readonly accesorioId: number;
    public readonly nombre: string;
    public readonly cantidad: string;
    public readonly notas: string;

    constructor(nombre: string, cantidad: string, notas?: string){
        this.accesorioId = 0;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.notas = notas || '';
    }
    
}