export class usuario{
    private readonly usuarioId: number;
    private nombreUsuario: string;
    private contrasenaHash: string;

    constructor(nombreUsuario: string, contrasenaHash: string){
        this.usuarioId = 0;
        this.nombreUsuario = nombreUsuario;
        this.contrasenaHash = contrasenaHash;
    }

    public getUsuarioId(): number {
        return this.usuarioId;
    }

    public getNombreUsuario(): string {    
        return this.nombreUsuario;
    }

    public getContrasenaHash(): string {
        return this.contrasenaHash;
    }

    public setNombreUsuario(nombreUsuario: string): void {
        this.nombreUsuario = nombreUsuario;
    }

    public setContrasenaHash(contrasenaHash: string): void {
        this.contrasenaHash = contrasenaHash;
    }
}