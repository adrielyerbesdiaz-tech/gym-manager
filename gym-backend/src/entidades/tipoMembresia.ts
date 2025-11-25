
export class tipoMembresia{
    private readonly tipoMembresiaID: number;
    private nombre: string;
    private duracionDias: number;
    private precio: number;

    constructor(nombre: string, duracionDias: number, precio: number){
        this.tipoMembresiaID = 0;
        this.nombre = nombre;
        this.duracionDias = duracionDias;
        this.precio = precio;
    }

    public getTipoMembresiaID(): number {
        return this.tipoMembresiaID;
    }

    public getNombre(): string {    
        return this.nombre;
    }

    public getDuracionDias(): number {
        return this.duracionDias;
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

    public setDuracionDias(duracionDias: number): void {
        this.duracionDias = duracionDias;
    }

}