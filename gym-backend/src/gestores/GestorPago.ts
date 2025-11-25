import Database from 'better-sqlite3';
import { pago } from '../entidades/pago';

export class GestorPago {
    private db: Database.Database;

    constructor(db: Database.Database) {
        this.db = db;
    }

    /**
     * Helper para convertir fila de BD a objeto, utilizando las propiedades de la tabla.
     */
    private mapRowToPago(row: any): pago {
        // Usamos el constructor que acepta ID y Date para reconstruir el objeto
        // con los valores exactos de la BD.
        const payment = new pago(
            row.membresia_Id,
            row.monto,
            row.ID, // pagoId
            new Date(row.fechaPago) // fechaPago (reconstruye Date a partir del TEXT de la BD)
        );
        return payment;
    }

    public agregar(pago: pago): number {
        const stmt = this.db.prepare(`
            INSERT INTO pagos (membresia_Id, monto, fechaPago)
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(
            pago.getMembresiaID(),
            pago.getMonto(),
            pago.getFechaPago().toISOString() // Guarda la fecha como texto ISO 8601
        );

        return result.lastInsertRowid as number;
    }

    public obtenerTodos(): pago[] {
        const stmt = this.db.prepare(`
            SELECT * FROM pagos ORDER BY fechaPago DESC
        `);
        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToPago(row));
    }

    public buscarPorId(id: number): pago | null {
        const stmt = this.db.prepare(`
            SELECT * FROM pagos WHERE ID = ?
        `);
        const row = stmt.get(id) as any;
        if (!row) return null;
        return this.mapRowToPago(row);
    }

    public buscarPorMembresiaId(membresiaId: number): pago[] {
        const stmt = this.db.prepare(`
            SELECT * FROM pagos 
            WHERE membresia_Id = ? 
            ORDER BY fechaPago DESC
        `);
        const rows = stmt.all(membresiaId) as any[];
        return rows.map(row => this.mapRowToPago(row));
    }
    
    public eliminar(id: number): boolean {
        const stmt = this.db.prepare(`
            DELETE FROM pagos WHERE ID = ?
        `);
        const result = stmt.run(id);
        return result.changes > 0;
    }
}