import Database from 'better-sqlite3';
import { membresia } from '../entidades/membresia';

export class GestorMembresia {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    // Helper para convertir fila de BD a objeto
    private mapRowToMembresia(row: any): membresia {
        // Creamos la instancia con los datos básicos
        const nuevaMembresia = new membresia(
            row.TipoMembresiaID,
            row.UsuarioID
        );
        
        // Asignamos las propiedades readonly (ID y fecha real de la BD)
        (nuevaMembresia as any).membresiaId = row.ID;
        (nuevaMembresia as any).fechaInicio = new Date(row.FechaInicio);
        
        return nuevaMembresia;
    }

    public agregar(item: membresia): number {
        const stmt = this.db.prepare(`
            INSERT INTO Membresias (TipoMembresiaID, UsuarioID, FechaInicio)
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(
            item.getTipoMembresiaID(),
            item.getUsuarioID(),
            item.getFechaInicio().toISOString()
        );

        return result.lastInsertRowid as number;
    }

    public obtenerTodos(): membresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias ORDER BY FechaInicio DESC
        `);
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToMembresia(row));
    }

    public buscarPorId(id: number): membresia | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias WHERE ID = ?
        `);
        const row = stmt.get(id) as any;
        
        if (!row) return null;
        return this.mapRowToMembresia(row);
    }

    public buscarPorUsuarioId(usuarioId: number): membresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias 
            WHERE UsuarioID = ? 
            ORDER BY FechaInicio DESC
        `);
        const rows = stmt.all(usuarioId) as any[];
        return rows.map(row => this.mapRowToMembresia(row));
    }

    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM Membresias WHERE ID = ?
        `);
        const result = stmt.run(id);
        return result.changes > 0;
    }
    
    // Verificar si un usuario ya tiene una membresía activa (opcional, útil para validaciones)
    // Asume que la lógica de "activa" depende de fechas que se calcularían en el servicio
    // o simplemente verifica existencia reciente.
}