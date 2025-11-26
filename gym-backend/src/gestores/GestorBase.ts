import Database from 'better-sqlite3';

export abstract class GestorBase<T> {
    protected db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    // Métodos abstractos que cada gestor debe implementar
    protected abstract getNombreTabla(): string;
    protected abstract getColumnasInsert(): string[];
    protected abstract getValoresInsert(entidad: T): any[];
    protected abstract mapRowToEntity(row: any): T;

    // Método genérico para agregar
    public agregar(entidad: T): number {
        const columnas = this.getColumnasInsert().join(', ');
        const placeholders = this.getColumnasInsert().map(() => '?').join(', ');
        
        const stmt = this.db.prepare(`
            INSERT INTO ${this.getNombreTabla()} (${columnas})
            VALUES (${placeholders})
        `);

        const valores = this.getValoresInsert(entidad);
        const result = stmt.run(...valores);

        return result.lastInsertRowid as number;
    }

    // Método genérico para obtener todos
    public obtenerTodos(): T[] {
        const stmt = this.db.prepare(`
            SELECT * FROM ${this.getNombreTabla()}
        `);

        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    // Método genérico para buscar por ID
    public buscarPorId(id: number): T | null {
        const stmt = this.db.prepare(`
            SELECT * FROM ${this.getNombreTabla()} WHERE ID = ?
        `);

        const row = stmt.get(id) as any;
        return row ? this.mapRowToEntity(row) : null;
    }

    // Método genérico para eliminar
    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM ${this.getNombreTabla()} WHERE ID = ?
        `);

        const result = stmt.run(id);
        return result.changes > 0;
    }

    // Método genérico para verificar existencia
    public existe(id: number): boolean {
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count FROM ${this.getNombreTabla()} WHERE ID = ?
        `);

        const result = stmt.get(id) as any;
        return result.count > 0;
    }

    // Método genérico para búsqueda con LIKE
    protected buscarPorColumna(columna: string, valor: string): T[] {
        const stmt = this.db.prepare(`
            SELECT * FROM ${this.getNombreTabla()} 
            WHERE ${columna} LIKE ?
            ORDER BY ${columna}
        `);

        const rows = stmt.all(`%${valor}%`) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    // Método genérico para actualizar una columna
    protected actualizarColumna(id: number, columna: string, valor: any): boolean {
        const stmt = this.db.prepare(`
            UPDATE ${this.getNombreTabla()} SET ${columna} = ? WHERE ID = ?
        `);

        const result = stmt.run(valor, id);
        return result.changes > 0;
    }
}