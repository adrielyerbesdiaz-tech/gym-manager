
export class tipoMembresia{
    private readonly tipoMembresiaID: number;
    private nombre: string;
    private duracionValor: number;
    private duracionTipo: string;
    private precio: number;


    constructor(nombre: string, duracionValor: number, duracionTipo: string, precio: number, tipoMembresiaID?:number){
        this.tipoMembresiaID = tipoMembresiaID || 0;
        this.nombre = nombre;
        this.duracionValor = duracionValor;
        this.duracionTipo = duracionTipo;
        this.precio = precio;
    }

    public getTipoMembresiaID(): number {
        return this.tipoMembresiaID;
    }

    public getNombre(): string {    
        return this.nombre;
    }

    public getDuracionValor(): number {
        return this.duracionValor;
    }

    public getDuracionTipo(): string {
        return this.duracionTipo;
    }

    public getPrecio(): number {
        return this.precio;
    }

    public setPrecio(precio: number): void {
        this.precio = precio;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public setDuracionValor(duracionValor: number): void {
        this.duracionValor = duracionValor;
    }

    public setDuracionTipo(duracionTipo: string): void {
        this.duracionTipo = duracionTipo;
    }

}