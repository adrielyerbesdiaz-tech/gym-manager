
export class equipamiento{
    private readonly equipoId: number;
    private imagenUrl?: string;
    private readonly nombre: string;
    private readonly tipo: string;
    private descripcion?: string;

    constructor(nombre: string, tipo: string, imagenUrl?: string, descripcion?: string){
        this.equipoId = 0;
        this.imagenUrl = imagenUrl;
        this.nombre = nombre;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }

    public getEquipoId(): number {
        return this.equipoId;
    }

    public getImagenUrl(): string | undefined {
        return this.imagenUrl;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public getDescripcion(): string | undefined {
        return this.descripcion;
    }

    public setImagenUrl(imagenUrl: string): void {
        this.imagenUrl = imagenUrl;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

}