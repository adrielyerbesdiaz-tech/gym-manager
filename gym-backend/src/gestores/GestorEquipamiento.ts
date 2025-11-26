import { equipamiento } from '../entidades/Equipamiento';
import { GestorBase } from './GestorBase';

export class GestorEquipamiento extends GestorBase<equipamiento> {
    
    protected getNombreTabla(): string {
        return 'Equipamiento';
    }

    protected getColumnasInsert(): string[] {
        return ['Nombre', 'Tipo', 'ImagenUrl', 'Descripcion'];
    }

    protected getValoresInsert(equipo: equipamiento): any[] {
        return [
            equipo.getNombre(),
            equipo.getTipo(),
            equipo.getImagenUrl(),
            equipo.getDescripcion()
        ];
    }

    protected mapRowToEntity(row: any): equipamiento {
        const equipo = new equipamiento(
            row.Nombre,
            row.Tipo,
            row.ImagenUrl,
            row.Descripcion
        );
        // Asignar el ID (readonly)
        (equipo as any).equipoId = row.ID;
        return equipo;
    }

    // Métodos específicos de Equipamiento
    public buscarPorNombre(nombre: string): equipamiento[] {
        return this.buscarPorColumna('Nombre', nombre);
    }

    public buscarPorTipo(tipo: string): equipamiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Equipamiento WHERE Tipo = ?
        `);
        const rows = stmt.all(tipo) as any[];
        return rows.map(row => this.mapRowToEntity(row));
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
}