import { cliente } from '../entidades/cliente';
import { GestorBase } from './GestorBase';

export class GestorCliente extends GestorBase<cliente> {
    
    // Implementar métodos abstractos
    protected getNombreTabla(): string {
        return 'Clientes';
    }

    protected getColumnasInsert(): string[] {
        return ['Nombre_Completo', 'Telefono', 'Notas', 'Fecha_Registro'];
    }

    protected getValoresInsert(cliente: cliente): any[] {
        return [
            cliente.getNombreCompleto(),
            cliente.getTelefono(),
            cliente.getNotas(),
            cliente.getFechaRegistro().toISOString()
        ];
    }

    protected mapRowToEntity(row: any): cliente {
        return new cliente(
            row.Nombre_Completo,
            row.Telefono,
            row.Notas,
            row.ID
        );
    }

    // Métodos específicos de Cliente (que no están en la base)
    public buscarPorNombre(nombre: string): cliente[] {
        return this.buscarPorColumna('Nombre_Completo', nombre);
    }

    public buscarPorTelefono(telefono: number): cliente | null {
        const stmt = this.db.prepare(`
            SELECT * FROM Clientes WHERE Telefono = ?
        `);

        const row = stmt.get(telefono) as any;
        return row ? this.mapRowToEntity(row) : null;
    }

    public actualizarNotas(id: number, notas: string): boolean {
        return this.actualizarColumna(id, 'Notas', notas);
    }

    public actualizarTelefono(id: number, telefono: number): boolean {
        return this.actualizarColumna(id, 'Telefono', telefono);
    }

    // Método de búsqueda combinada (específico de Cliente)
    public buscar(criterio: string | number): cliente[] {
        if (typeof criterio === 'number') {
            const porId = this.buscarPorId(criterio);
            if (porId) return [porId];

            const porTelefono = this.buscarPorTelefono(criterio);
            if (porTelefono) return [porTelefono];

            return [];
        }

        return this.buscarPorNombre(criterio);
    }
}