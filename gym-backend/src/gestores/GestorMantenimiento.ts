import { mantenimiento } from '../entidades/Mantenimiento';
import { GestorBase } from './GestorBase';

export class GestorMantenimiento extends GestorBase<mantenimiento> {
    
    protected getNombreTabla(): string {
        return 'Mantenimiento';
    }

    protected getColumnasInsert(): string[] {
        return ['ID_Equipamiento', 'Fecha_Mantenimiento', 'Descripcion'];
    }

    protected getValoresInsert(mant: mantenimiento): any[] {
        return [
            mant.getIdEquipamiento(),
            mant.getFechaMantenimiento().toISOString(),
            mant.getDescripcion()
        ];
    }

    protected mapRowToEntity(row: any): mantenimiento {
        const mant = new mantenimiento(
            row.ID_Equipamiento,
            row.ID, // mantenimientoId
            new Date(row.Fecha_Mantenimiento),
            row.Descripcion
        );
        return mant;
    }

    // Métodos específicos similares a GestorCliente

    // Buscar por equipo (usando consulta directa para números)
    public buscarPorEquipo(idEquipamiento: number): mantenimiento[] {
        const stmt = this.db.prepare(`
            SELECT * FROM ${this.getNombreTabla()} 
            WHERE ID_Equipamiento = ?
        `);
        const rows = stmt.all(idEquipamiento) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    // Buscar por descripción (usa el método base con LIKE)
    public buscarPorDescripcion(descripcion: string): mantenimiento[] {
        return this.buscarPorColumna('Descripcion', descripcion);
    }

    // Actualizar métodos específicos similares a GestorCliente
    public actualizarEquipo(id: number, idEquipamiento: number): boolean {
        return this.actualizarColumna(id, 'ID_Equipamiento', idEquipamiento);
    }

    public actualizarFecha(id: number, fechaMantenimiento: Date): boolean {
        return this.actualizarColumna(id, 'Fecha_Mantenimiento', fechaMantenimiento.toISOString());
    }

    public actualizarDescripcion(id: number, descripcion: string): boolean {
        return this.actualizarColumna(id, 'Descripcion', descripcion);
    }

    // Método completo de actualización (usa los métodos individuales)
    public actualizarMantenimiento(id: number, idEquipamiento: number, fechaMantenimiento: Date, descripcion: string): boolean {
        const actualizaciones = [
            this.actualizarEquipo(id, idEquipamiento),
            this.actualizarFecha(id, fechaMantenimiento),
            this.actualizarDescripcion(id, descripcion)
        ];

        // Verificar que todas las actualizaciones fueron exitosas
        return actualizaciones.every(result => result);
    }

    // Método de búsqueda combinada (similar a GestorCliente)
    public buscar(criterio: string | number): mantenimiento[] {
        if (typeof criterio === 'number') {
            const porId = this.buscarPorId(criterio);
            if (porId) return [porId];

            const porEquipo = this.buscarPorEquipo(criterio);
            if (porEquipo.length > 0) return porEquipo;

            return [];
        }

        // Si es string, buscar por descripción
        return this.buscarPorDescripcion(criterio);
    }
}