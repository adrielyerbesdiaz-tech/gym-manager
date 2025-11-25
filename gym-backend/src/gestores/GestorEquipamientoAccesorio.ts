import Database from 'better-sqlite3';
import { equipamientoAccessorio } from '../entidades/equipamientoAccesorio';

export class GestorEquipamientoAccesorio {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    /**
     * Helper para convertir fila de BD a objeto, manejando propiedades readonly.
     * Mapea Descripcion de la BD a notas de la clase.
     */
    private mapRowToAccesorio(row: any): equipamientoAccessorio {
        // Creamos la instancia con los valores disponibles en el constructor
        const accesorio = new equipamientoAccessorio(
            row.ID_Equipo,
            row.Nombre,
            row.Descripcion // Mapea Descripcion (BD) a notas (Clase)
        );
        // Forzamos la asignación del ID (readonly/privado)
        (accesorio as any).accesorioId = row.ID;
        return accesorio;
    }

    public agregar(accesorio: equipamientoAccessorio): number {
        const stmt = this.db.prepare(`
            INSERT INTO Equipamiento_Accesorio (ID_Equipo, Nombre, Descripcion)
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(
            accesorio.getEquipoId(),
            accesorio.getNombre(),
            accesorio.getNotas() // Guarda 'notas' en 'Descripcion' de la BD
        );

        return result.lastInsertRowid as number;
    }

    public obtenerTodos(): equipamientoAccessorio[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento_Accesorio ORDER BY Nombre
        `);
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToAccesorio(row));
    }

    public buscarPorId(id: number): equipamientoAccessorio | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento_Accesorio WHERE ID = ?
        `);
        const row = stmt.get(id) as any;
        if (!row) return null;
        return this.mapRowToAccesorio(row);
    }

    public buscarPorEquipoId(equipoId: number): equipamientoAccessorio[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento_Accesorio 
            WHERE ID_Equipo = ?
            ORDER BY Nombre
        `);
        const rows = stmt.all(equipoId) as any[];
        return rows.map(row => this.mapRowToAccesorio(row));
    }
    
    // Asumimos que solo 'notas' (Descripcion) es editable después de la creación
    public actualizarNotas(id: number, notas: string): boolean {
        const stmt = this.db.prepare(`
            UPDATE Equipamiento_Accesorio 
            SET Descripcion = ?
            WHERE ID = ?
        `);
        const result = stmt.run(notas, id);
        return result.changes > 0;
    }

    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM Equipamiento_Accesorio WHERE ID = ?
        `);
        const result = stmt.run(id);
        return result.changes > 0;
    }
}