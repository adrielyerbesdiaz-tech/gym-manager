import { membresia } from '../entidades/membresia';
import { GestorBase } from './GestorBase';

export class GestorMembresia extends GestorBase<membresia> {
    
    protected getNombreTabla(): string {
        return 'Membresias';
    }

    protected getColumnasInsert(): string[] {
        return ['ID_Tipo', 'ID_Usuario', 'Fecha_Inicio, Fecha_Vencimiento'];
    }

    protected getValoresInsert(memb: membresia): any[] {
        return [
            memb.getTipoMembresiaID(),
            memb.getUsuarioID(),
            memb.getFechaInicio().toISOString(),
            memb.getFechaVencimiento().toISOString()
        ];
    }

    protected mapRowToEntity(row: any): membresia {
        const memb = new membresia(
            row.ID_Tipo, 
            row.ID_Usuario,
            row.ID,
            new Date(row.Fecha_Inicio),
            new Date(row.Fecha_Vencimiento)
        );
        return memb;
    }

    // Métodos específicos
    public buscarPorUsuarioId(usuarioId: number): membresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias WHERE ID_Usuario = ?
            ORDER BY Fecha_Inicio DESC
        `);

        const rows = stmt.all(usuarioId) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public buscarPorTipoId(tipoId: number): membresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias WHERE ID_Tipo = ?
            ORDER BY Fecha_Inicio DESC
        `);

        const rows = stmt.all(tipoId) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public buscarMembresiasActivas(): membresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias 
            WHERE Fecha_Vencimiento >= date('now')
            ORDER BY Fecha_Vencimiento ASC
        `);

        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public buscarMembresiasProximasAVencer(dias: number = 7): membresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Membresias 
            WHERE Fecha_Vencimiento BETWEEN date('now') AND date('now', ?)
            ORDER BY Fecha_Vencimiento ASC
        `);

        const rows = stmt.all(`+${dias} days`) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }
}