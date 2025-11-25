import Database from 'better-sqlite3';
import { usuario } from '../entidades/usuario';

export class GestorUsuario {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    // Helper para convertir fila de BD a objeto (necesario para asignar el ID privado)
    private mapRowToUsuario(row: any): usuario {
        // Creamos la instancia con nombre y hash
        const user = new usuario(
            row.NombreUsuario,
            row.ContrasenaHash
        );
        
        // Forzamos la asignación del ID ya que es readonly/privado en la clase original
        (user as any).usuarioId = row.ID;
        return user;
    }

    public agregar(user: usuario): number {
        const stmt = this.db.prepare(`
            INSERT INTO Usuarios (NombreUsuario, ContrasenaHash)
            VALUES (?, ?)
        `);

        const result = stmt.run(
            user.getNombreUsuario(),
            user.getContrasenaHash()
        );

        return result.lastInsertRowid as number;
    }

    public obtenerTodos(): usuario[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Usuarios ORDER BY NombreUsuario
        `);
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToUsuario(row));
    }

    public buscarPorId(id: number): usuario | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Usuarios WHERE ID = ?
        `);
        const row = stmt.get(id) as any;
        if (!row) return null;
        return this.mapRowToUsuario(row);
    }

    public buscarPorNombreUsuario(nombreUsuario: string): usuario | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Usuarios WHERE NombreUsuario = ?
        `);
        // Usamos .get() porque el nombre de usuario debe ser único
        const row = stmt.get(nombreUsuario) as any; 
        if (!row) return null;
        return this.mapRowToUsuario(row);
    }

    public actualizarNombre(id: number, nombreUsuario: string): boolean {
        const stmt = this.db.prepare(`
            UPDATE Usuarios SET NombreUsuario = ? WHERE ID = ?
        `);
        const result = stmt.run(nombreUsuario, id);
        return result.changes > 0;
    }

    public actualizarContrasenaHash(id: number, contrasenaHash: string): boolean {
        const stmt = this.db.prepare(`
            UPDATE Usuarios SET ContrasenaHash = ? WHERE ID = ?
        `);
        const result = stmt.run(contrasenaHash, id);
        return result.changes > 0;
    }

    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM Usuarios WHERE ID = ?
        `);
        const result = stmt.run(id);
        return result.changes > 0;
    }
}