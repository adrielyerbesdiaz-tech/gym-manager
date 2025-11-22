export class usuario {
    private readonly usuarioId: number;
    private nombreUsuario: string;
    private contrasenaHash: string;
    private email: string;

    constructor(nombreUsuario: string, contrasenaHash: string, email: string) {
        this.usuarioId = 0;
        this.nombreUsuario = nombreUsuario;
        this.contrasenaHash = contrasenaHash;
        this.email = email;
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

    public getEmail(): string {
        return this.email;
    }

    public setNombreUsuario(nombreUsuario: string): void {
        this.nombreUsuario = nombreUsuario;
    }

    public setContrasenaHash(contrasenaHash: string): void {
        this.contrasenaHash = contrasenaHash;
    }

    public setEmail(email: string): void {
        this.email = email;
    }
}