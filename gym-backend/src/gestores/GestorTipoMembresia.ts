import { tipoMembresia } from '../entidades/TipoMembresiaa';
import { GestorBase } from './GestorBase';

export class GestorTipoMembresia extends GestorBase<tipoMembresia> {
    
    protected getNombreTabla(): string {
        return 'Tipos_Membresia';
    }

    protected getColumnasInsert(): string[] {
        return ['Nombre', 'Duracion_Valor', 'Duracion_Tipo', 'Precio'];
    }

    protected getValoresInsert(tipo: tipoMembresia): any[] {
        return [
            tipo.getNombre(),
            tipo.getDuracionValor(),
            tipo.getDuracionTipo(),
            tipo.getPrecio()
        ];
    }

    protected mapRowToEntity(row: any): tipoMembresia {
        return new tipoMembresia(
            row.Nombre,
            row.Duracion_Valor,
            row.Duracion_Tipo,
            row.Precio,
            row.ID
        );
    }

    // Métodos específicos
    public buscarPorNombre(nombre: string): tipoMembresia[] {
        return this.buscarPorColumna('Nombre', nombre);
    }

    public actualizar(tipo: tipoMembresia): boolean {
        const stmt = this.db.prepare(`
            UPDATE Tipos_Membresia 
            SET Nombre = ?, Duracion_Valor = ?, Duracion_Tipo = ?, Precio = ?
            WHERE ID = ?
        `);

        const result = stmt.run(
            tipo.getNombre(),
            tipo.getDuracionValor(),
            tipo.getDuracionTipo(),
            tipo.getPrecio(),
            tipo.getTipoMembresiaID()
        );

        return result.changes > 0;
    }

    public actualizarPrecio(id: number, precio: number): boolean {
        return this.actualizarColumna(id, 'Precio', precio);
    }

    public actualizarNombre(id: number, nombre: string): boolean {
        return this.actualizarColumna(id, 'Nombre', nombre);
    }

    public actualizarDuracion(id: number, duracionValor: number, duracionTipo: string): boolean {
        const stmt = this.db.prepare(`
            UPDATE Tipos_Membresia 
            SET Duracion_Valor = ?, Duracion_Tipo = ? 
            WHERE ID = ?
        `);

        const result = stmt.run(duracionValor, duracionTipo, id);
        return result.changes > 0;
    }

    public estaEnUso(id: number): boolean {
        const stmt = this.db.prepare(`
            SELECT COUNT(*) as count FROM Membresias WHERE ID_Tipo = ?
        `);

        const result = stmt.get(id) as any;
        return result.count > 0;
    }

    public obtenerPorPrecio(ascendente: boolean = true): tipoMembresia[] {
        const orden = ascendente ? 'ASC' : 'DESC';
        const stmt = this.db.prepare(`
            SELECT * FROM Tipos_Membresia ORDER BY Precio ${orden}
        `);

        const rows = stmt.all() as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }

    public obtenerPorTipoDuracion(duracionTipo: string): tipoMembresia[] {
        const stmt = this.db.prepare(`
            SELECT * FROM Tipos_Membresia 
            WHERE Duracion_Tipo = ?
            ORDER BY Duracion_Valor
        `);

        const rows = stmt.all(duracionTipo) as any[];
        return rows.map(row => this.mapRowToEntity(row));
    }
}