import Database from 'better-sqlite3';
import { equipamiento } from '../entidades/equipamiento';

export class GestorEquipamiento {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    // Helper para convertir fila de BD a objeto (necesario para asignar el ID privado)
    private mapRowToEquipamiento(row: any): equipamiento {
        const equipo = new equipamiento(
            row.Nombre,
            row.Tipo,
            row.ImagenUrl,
            row.Descripcion
        );
        // Forzamos la asignación del ID ya que es readonly/privado en la clase original
        (equipo as any).equipoId = row.ID;
        return equipo;
    }

    public agregar(equipo: equipamiento): number {
        const stmt = this.db.prepare(`
            INSERT INTO Equipamiento (Nombre, Tipo, ImagenUrl, Descripcion)
            VALUES (?, ?, ?, ?)
        `);

        const result = stmt.run(
            equipo.getNombre(),
            equipo.getTipo(),
            equipo.getImagenUrl(),
            equipo.getDescripcion()
        );

        return result.lastInsertRowid as number;
    }

    public obtenerTodos(): equipamiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento ORDER BY Nombre
        `);
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToEquipamiento(row));
    }

    public buscarPorId(id: number): equipamiento | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento WHERE ID = ?
        `);
        const row = stmt.get(id) as any;
        if (!row) return null;
        return this.mapRowToEquipamiento(row);
    }

    public buscarPorNombre(nombre: string): equipamiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento 
            WHERE Nombre LIKE ? 
            ORDER BY Nombre
        `);
        const rows = stmt.all(`%${nombre}%`) as any[];
        return rows.map(row => this.mapRowToEquipamiento(row));
    }

    public buscarPorTipo(tipo: string): equipamiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento WHERE Tipo = ?
        `);
        const rows = stmt.all(tipo) as any[];
        return rows.map(row => this.mapRowToEquipamiento(row));
    }

    public actualizar(id: number, nombre: string, tipo: string, imagenUrl?: string, descripcion?: string): boolean {
        const stmt = this.db.prepare(`
            UPDATE Equipamiento 
            SET Nombre = ?, Tipo = ?, ImagenUrl = ?, Descripcion = ?
            WHERE ID = ?
        `);
        const result = stmt.run(nombre, tipo, imagenUrl, descripcion, id);
        return result.changes > 0;
    }

    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM Equipamiento WHERE ID = ?
        `);
        const result = stmt.run(id);
        return result.changes > 0;
    }
}