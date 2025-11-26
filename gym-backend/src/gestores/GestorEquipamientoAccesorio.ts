import { equipamientoAccessorio } from '../entidades/EquipamientoaAccesorio';
import { GestorBase } from './GestorBase';

export class GestorEquipamientoAccesorio extends GestorBase<equipamientoAccessorio> {
    
    protected getNombreTabla(): string {
        return 'Equipamiento_Accesorio';
    }

    protected getColumnasInsert(): string[] {
        return ['ID_Equipo', 'Nombre', 'Notas'];
    }

    protected getValoresInsert(acc: equipamientoAccessorio): any[] {
        return [
            acc.equipoId, // Asumiendo que tienes un getter para equipoId
            acc.nombre,
            acc.notas
        ];
    }

    protected mapRowToEntity(row: any): equipamientoAccessorio {
        const acc = new equipamientoAccessorio(
            row.ID_Equipo,
            row.Nombre,
            row.Notas
        );
        // Asignar ID desde la BD
        (acc as any).accesorioId = row.ID;
        return acc;
    }

    // Métodos específicos
    public buscarPorEquipoId(equipoId: number): equipamientoAccessorio[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento_Accesorio 
            WHERE ID_Equipo = ?
            ORDER BY Nombre
        `);

        const rows = stmt.all(equipoId) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public actualizarNotas(id: number, notas: string): boolean {
        return this.actualizarColumna(id, 'Notas', notas);
    }
}