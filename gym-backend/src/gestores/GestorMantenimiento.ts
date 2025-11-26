import { mantenimiento } from '../entidades/Mantenimiento';
import { GestorBase } from './GestorBase';

export class GestorMantenimiento extends GestorBase<mantenimiento> {
    
    protected getNombreTabla(): string {
        return 'Mantenimiento';
    }

    protected getColumnasInsert(): string[] {
        return ['Tipo_Mantenimiento', 'Fecha_Mantenimiento'];
    }

    protected getValoresInsert(mant: mantenimiento): any[] {
        return [
            mant.tipoMantenimiento,
            mant.fechaMantenimiento.toISOString()
        ];
    }

    protected mapRowToEntity(row: any): mantenimiento {
        const mant = new mantenimiento(row.Tipo_Mantenimiento);
        // Asignar ID y fecha desde la BD
        (mant as any).mantenimientoId = row.ID;
        (mant as any).fechaMantenimiento = new Date(row.Fecha_Mantenimiento);
        return mant;
    }

    // Métodos específicos
    public buscarPorTipo(tipo: string): mantenimiento[] {
        return this.buscarPorColumna('Tipo_Mantenimiento', tipo);
    }
}