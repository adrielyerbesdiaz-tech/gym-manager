import Database from 'better-sqlite3';
import { mantenimiento } from '../entidades/mantenimiento';

export class GestorMantenimiento {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    // Helper para convertir fila de BD a objeto
    private mapRowToMantenimiento(row: any): mantenimiento {
        // Creamos la instancia con el tipo
        const mant = new mantenimiento(row.Tipo);
        
        // Forzamos la asignación de propiedades readonly recuperadas de la BD
        (mant as any).mantenimientoId = row.ID;
        (mant as any).fechaMantenimiento = new Date(row.Fecha);
        
        return mant;
    }

    public agregar(mant: mantenimiento): number {
        const stmt = this.db.prepare(`
            INSERT INTO Mantenimientos (Tipo, Fecha)
            VALUES (?, ?)
        `);

        const result = stmt.run(
            mant.tipoMantenimiento,
            mant.fechaMantenimiento.toISOString()
        );

        return result.lastInsertRowid as number;
    }

    public obtenerTodos(): mantenimiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Mantenimientos ORDER BY Fecha DESC
        `);
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToMantenimiento(row));
    }

    public buscarPorId(id: number): mantenimiento | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Mantenimientos WHERE ID = ?
        `);
        const row = stmt.get(id) as any;
        if (!row) return null;
        return this.mapRowToMantenimiento(row);
    }

    public buscarPorTipo(tipo: string): mantenimiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Mantenimientos 
            WHERE Tipo LIKE ? 
            ORDER BY Fecha DESC
        `);
        const rows = stmt.all(`%${tipo}%`) as any[];
        return rows.map(row => this.mapRowToMantenimiento(row));
    }

    // Opcional: Buscar por rango de fechas
    public buscarPorFecha(fechaInicio: string, fechaFin: string): mantenimiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Mantenimientos 
            WHERE Fecha BETWEEN ? AND ?
            ORDER BY Fecha DESC
        `);
        const rows = stmt.all(fechaInicio, fechaFin) as any[];
        return rows.map(row => this.mapRowToMantenimiento(row));
    }

    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM Mantenimientos WHERE ID = ?
        `);
        const result = stmt.run(id);
        return result.changes > 0;
    }
}