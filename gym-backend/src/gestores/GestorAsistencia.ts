import { asistencia } from '../entidades/Asistenciaa';
import { GestorBase } from './GestorBase';

export class GestorAsistencia extends GestorBase<asistencia> {
    
    protected getNombreTabla(): string {
        return 'Asistencias';
    }

    protected getColumnasInsert(): string[] {
        return ['ID_Cliente', 'Fecha_Check_In'];
    }

    protected getValoresInsert(asist: asistencia): any[] {
        return [
            asist.getClienteID(),
            asist.getFechaCheckIn().toISOString()
        ];
    }

    protected mapRowToEntity(row: any): asistencia {
        return new asistencia(
            row.ID_Cliente,
            row.ID_Asistencia || row.ID,
            new Date(row.Fecha_Check_In)
        );
    }

    // Métodos específicos de Asistencia
    public buscarPorCliente(clienteId: number): asistencia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Asistencias 
            WHERE ID_Cliente = ?
            ORDER BY Fecha_Check_In DESC
        `);

        const rows = stmt.all(clienteId) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public yaRegistroHoy(clienteId: number): boolean {
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count 
            FROM Asistencias 
            WHERE ID_Cliente = ? 
            AND DATE(Fecha_Check_In) = DATE('now')
        `);

        const result = stmt.get(clienteId) as any;
        return result.count > 0;
    }

    public obtenerAsistenciasHoy(): any[] {
        const stmt = this.db.prepare(`
            SELECT 
                a.ID_Asistencia,
                a.ID_Cliente,
                a.Fecha_Check_In,
                c.Nombre_Completo,
                c.Telefono
            FROM Asistencias a
            INNER JOIN Clientes c ON a.ID_Cliente = c.ID
            WHERE DATE(a.Fecha_Check_In) = DATE('now')
            ORDER BY a.Fecha_Check_In DESC
        `);

        return stmt.all() as any[];
    }

    public obtenerPorRangoFechas(fechaInicio: Date, fechaFin: Date): any[] {
        const stmt = this.db.prepare(`
            SELECT 
                a.ID_Asistencia,
                a.ID_Cliente,
                a.Fecha_Check_In,
                c.Nombre_Completo,
                c.Telefono
            FROM Asistencias a
            INNER JOIN Clientes c ON a.ID_Cliente = c.ID
            WHERE DATE(a.Fecha_Check_In) BETWEEN DATE(?) AND DATE(?)
            ORDER BY a.Fecha_Check_In DESC
        `);

        return stmt.all(
            fechaInicio.toISOString().split('T')[0],
            fechaFin.toISOString().split('T')[0]
        ) as any[];
    }

    public contarPorCliente(clienteId: number): number {
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count FROM Asistencias WHERE ID_Cliente = ?
        `);

        const result = stmt.get(clienteId) as any;
        return result.count;
    }

    public obtenerEstadisticas() {
        const stmt = this.db.prepare(`
            SELECT 
                COUNT(*) as total_asistencias,
                COUNT(DISTINCT ID_Cliente) as clientes_unicos,
                DATE(Fecha_Check_In) as fecha
            FROM Asistencias
            WHERE DATE(Fecha_Check_In) >= DATE('now', '-30 days')
            GROUP BY DATE(Fecha_Check_In)
            ORDER BY fecha DESC
        `);

        return stmt.all() as any[];
    }
}