import { membresia } from '../entidades/membresia';
import { GestorBase } from './GestorBase';

export class GestorMembresia extends GestorBase<membresia> {
    
    protected getNombreTabla(): string {
        return 'Membresias';
    }

    protected getColumnasInsert(): string[] {
        return ['ID_Tipo', 'ID_Usuario', 'Fecha_Inicio'];
    }

    protected getValoresInsert(memb: membresia): any[] {
        return [
            memb.getTipoMembresiaID(),
            memb.getUsuarioID(),
            memb.getFechaInicio().toISOString()
        ];
    }

    protected mapRowToEntity(row: any): membresia {
        const memb = new membresia(row.ID_Tipo, row.ID_Usuario);
        // Asignar ID y fecha desde la BD
        (memb as any).membresiaId = row.ID;
        (memb as any).fechaInicio = new Date(row.Fecha_Inicio);
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
}