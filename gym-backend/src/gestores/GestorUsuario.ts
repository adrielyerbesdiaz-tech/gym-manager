import { usuario } from '../entidades/Usuarioa';
import { GestorBase } from './GestorBase';

export class GestorUsuario extends GestorBase<usuario> {
    
    protected getNombreTabla(): string {
        return 'Usuarios';
    }

    protected getColumnasInsert(): string[] {
        return ['Nombre_Usuario', 'Contrasena_Hash'];
    }

    protected getValoresInsert(user: usuario): any[] {
        return [
            user.getNombreUsuario(),
            user.getContrasenaHash()
        ];
    }

    protected mapRowToEntity(row: any): usuario {
        const user = new usuario(row.Nombre_Usuario, row.Contrasena_Hash);
        // Asignar ID desde la BD
        (user as any).usuarioId = row.ID;
        return user;
    }

    // Métodos específicos
    public buscarPorNombreUsuario(nombreUsuario: string): usuario | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Usuarios WHERE Nombre_Usuario = ?
        `);

        const row = stmt.get(nombreUsuario) as any;
        return row ? this.mapRowToEntity(row) : null;
    }

    public actualizarNombre(id: number, nombreUsuario: string): boolean {
        return this.actualizarColumna(id, 'Nombre_Usuario', nombreUsuario);
    }

    public actualizarContrasenaHash(id: number, contrasenaHash: string): boolean {
        return this.actualizarColumna(id, 'Contrasena_Hash', contrasenaHash);
    }
}