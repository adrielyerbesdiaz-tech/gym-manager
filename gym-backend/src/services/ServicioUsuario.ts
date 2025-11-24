import { usuario } from '../entities/usuario';

export interface IGestorUsuario {
    guardar(usuario: usuario): void;
    buscarPorNombreUsuario(nombreUsuario: string): usuario | null;
    buscarPorEmail(email: string): usuario | null;
}

export class ServicioUsuario {
    private readonly gestorUsuario: IGestorUsuario;

    constructor(gestorUsuario: IGestorUsuario) {
        this.gestorUsuario = gestorUsuario;
    }

    public login(nombreUsuario: string, contrasena: string): usuario {
        if (!nombreUsuario || !contrasena) {
            throw new Error('Credenciales inválidas.');
        }

        const usuarioEncontrado = this.gestorUsuario.buscarPorNombreUsuario(nombreUsuario);

        if (!usuarioEncontrado) {
            throw new Error('Credenciales inválidas.');
        }

        if (usuarioEncontrado.getContrasenaHash() !== contrasena) {
            throw new Error('Credenciales inválidas.');
        }

        return usuarioEncontrado;
    }

    public recuperarContrasena(email: string): void {
        if (!email || !email.includes('@')) {
            throw new Error('Formato de correo electrónico inválido.');
        }

        const usuarioEncontrado = this.gestorUsuario.buscarPorEmail(email);

        if (usuarioEncontrado) {
            // Lógica de notificación
        }
    }

    public solicitarNuevaCuenta(nombreUsuario: string, contrasena: string, email: string): void {
        if (!nombreUsuario || !contrasena || !email) {
            throw new Error('Todos los datos son obligatorios.');
        }

        if (this.gestorUsuario.buscarPorNombreUsuario(nombreUsuario)) {
            throw new Error('El nombre de usuario no está disponible.');
        }

        if (this.gestorUsuario.buscarPorEmail(email)) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const nuevoUsuario = new usuario(nombreUsuario, contrasena, email);
        this.gestorUsuario.guardar(nuevoUsuario);
    }
}