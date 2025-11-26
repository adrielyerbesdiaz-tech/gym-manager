import { usuario } from '../entidades/Usuarioa';
import { GestorUsuario } from '../gestores/GestorUsuario';

export class ServicioUsuario {
    private readonly gestorUsuario: GestorUsuario;

    constructor(gestorUsuario: GestorUsuario) {
        this.gestorUsuario = gestorUsuario;
    }

    public crear(nombreUsuario: string, contrasenaHash: string): number {
        const nombreLimpio = nombreUsuario.trim();
        const hashLimpio = contrasenaHash.trim();
        
        // Validaciones
        if (!nombreLimpio || nombreLimpio.length < 4) {
            throw new Error('El nombre de usuario debe tener al menos 4 caracteres.');
        }
        if (!hashLimpio || hashLimpio.length < 10) { 
            throw new Error('El hash de la contraseña es demasiado corto.');
        }

        // Verificar unicidad del nombre de usuario
        const usuarioExistente = this.gestorUsuario.buscarPorNombreUsuario(nombreLimpio);
        if (usuarioExistente) {
            throw new Error(`El nombre de usuario '${nombreLimpio}' ya está en uso.`);
        }

        const nuevoUsuario = new usuario(nombreLimpio, hashLimpio);

        return this.gestorUsuario.agregar(nuevoUsuario);
    }

    public obtenerTodos(): usuario[] {
        return this.gestorUsuario.obtenerTodos();
    }

    public buscarPorId(id: number): usuario {
        const user = this.gestorUsuario.buscarPorId(id);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        return user;
    }
    
    public buscarPorNombreUsuario(nombreUsuario: string): usuario {
        const user = this.gestorUsuario.buscarPorNombreUsuario(nombreUsuario.trim());
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        return user;
    }

    public actualizarNombre(id: number, nuevoNombre: string): void {
        const nombreLimpio = nuevoNombre.trim();
        
        // 1. Verificar existencia del ID
        const usuarioExistente = this.gestorUsuario.buscarPorId(id);
        if (!usuarioExistente) {
            throw new Error('Usuario no encontrado.');
        }
        
        // 2. Verificar si el nuevo nombre ya está en uso por otro usuario
        const otroUsuarioConMismoNombre = this.gestorUsuario.buscarPorNombreUsuario(nombreLimpio);
        if (otroUsuarioConMismoNombre && otroUsuarioConMismoNombre.getUsuarioId() !== id) {
            throw new Error(`El nombre de usuario '${nombreLimpio}' ya está en uso.`);
        }

        const actualizado = this.gestorUsuario.actualizarNombre(id, nombreLimpio);
        if (!actualizado) {
            throw new Error('Error al actualizar el nombre de usuario.');
        }
    }

    public actualizarContrasena(id: number, nuevaContrasenaHash: string): void {
        const hashLimpio = nuevaContrasenaHash.trim();

        const usuarioExistente = this.gestorUsuario.buscarPorId(id);
        if (!usuarioExistente) {
            throw new Error('Usuario no encontrado.');
        }

        if (hashLimpio.length < 10) {
             throw new Error('El hash de la contraseña es demasiado corto.');
        }

        const actualizado = this.gestorUsuario.actualizarContrasenaHash(id, hashLimpio);
        if (!actualizado) {
            throw new Error('Error al actualizar la contraseña.');
        }
    }

    public eliminar(id: number): void {
        const user = this.gestorUsuario.buscarPorId(id);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        
        const eliminado = this.gestorUsuario.eliminar(id);
        if (!eliminado) {
            throw new Error('Error al eliminar el usuario.');
        }
    }
}