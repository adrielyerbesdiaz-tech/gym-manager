import { pago } from '../entidades/Pagoa';
import { GestorBase } from './GestorBase';

export class GestorPago extends GestorBase<pago> {
    
    protected getNombreTabla(): string {
        return 'Pagos';
    }

    protected getColumnasInsert(): string[] {
        return ['ID_Membresia', 'Monto', 'Fecha_Pago'];
    }

    protected getValoresInsert(pago: pago): any[] {
        return [
            pago.getMembresiaID(),
            pago.getMonto(),
            pago.getFechaPago().toISOString()
        ];
    }

    protected mapRowToEntity(row: any): pago {
        const p = new pago(row.ID_Membresia, row.Monto);
        // Asignar ID y fecha desde la BD
        (p as any).pagoId = row.ID;
        (p as any).fechaPago = new Date(row.Fecha_Pago);
        return p;
    }

    // Métodos específicos
    public buscarPorMembresiaId(membresiaId: number): pago[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Pagos 
            WHERE ID_Membresia = ?
            ORDER BY Fecha_Pago DESC
        `);

        const rows = stmt.all(membresiaId) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public obtenerTotalPorMembresia(membresiaId: number): number {
        const stmt = this.db.prepare(`
            SELECT SUM(Monto) as total FROM Pagos WHERE ID_Membresia = ?
        `);

        const result = stmt.get(membresiaId) as any;
        return result.total || 0;
    }
}