import Database from 'better-sqlite3';
import { cliente } from '../entidades/Cliente';

export class GestorCliente {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  // Agregar un nuevo cliente a la base de datos
  public agregar(cliente: cliente): number {
    const stmt = this.db.prepare(`
      INSERT INTO Clientes (Nombre_Completo, Telefono, Notas, Fecha_Registro)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      cliente.getNombreCompleto(),
      cliente.getTelefono(),
      cliente.getNotas(),
      cliente.getFechaRegistro().toISOString()
    );

    return result.lastInsertRowid as number;
  }

  // Buscar cliente por ID
  public buscarPorId(id: number): cliente | null {
    const stmt = this.db.prepare(`
      SELECT * FROM Clientes WHERE ID = ?
    `);

    const row = stmt.get(id) as any;

    if (!row) {
      return null;
    }

    return new cliente(
      row.Nombre_Completo,
      row.Telefono,
      row.Notas,
      row.ID
    );
  }

  // Buscar clientes por nombre (búsqueda parcial)
  public buscarPorNombre(nombre: string): cliente[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Clientes 
      WHERE Nombre_Completo LIKE ?
      ORDER BY Nombre_Completo
    `);

    const rows = stmt.all(`%${nombre}%`) as any[];

    return rows.map(row => new cliente(
      row.Nombre_Completo,
      row.Telefono,
      row.Notas,
      row.ID
    ));
  }

  // Buscar cliente por teléfono
  public buscarPorTelefono(telefono: number): cliente | null {
    const stmt = this.db.prepare(`
      SELECT * FROM Clientes WHERE Telefono = ?
    `);

    const row = stmt.get(telefono) as any;

    if (!row) {
      return null;
    }

    return new cliente(
      row.Nombre_Completo,
      row.Telefono,
      row.Notas,
      row.ID
    );
  }

  // Obtener todos los clientes
  public obtenerTodos(): cliente[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Clientes ORDER BY Nombre_Completo
    `);

    const rows = stmt.all() as any[];

    return rows.map(row => new cliente(
      row.Nombre_Completo,
      row.Telefono,
      row.Notas,
      row.ID
    ));
  }

  // Actualizar notas de un cliente
  public actualizarNotas(id: number, notas: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE Clientes SET Notas = ? WHERE ID = ?
    `);

    const result = stmt.run(notas, id);

    return result.changes > 0;
  }

  public actualizarTelefono(id: number, telefono: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE Clientes SET Telefono = ? WHERE ID = ?
    `);

    const result = stmt.run(telefono, id);

    return result.changes > 0;
  }


  // Eliminar cliente por ID
  public eliminar(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM Clientes WHERE ID = ?
    `);

    const result = stmt.run(id);

    return result.changes > 0;
  }

  // Buscar clientes (por ID, nombre o teléfono)
  public buscar(criterio: string | number): cliente[] {
    // Si es número, buscar por ID o teléfono
    if (typeof criterio === 'number') {
      const porId = this.buscarPorId(criterio);
      if (porId) {
        return [porId];
      }

      const porTelefono = this.buscarPorTelefono(criterio);
      if (porTelefono) {
        return [porTelefono];
      }

      return [];
    }

    // Si es string, buscar por nombre
    return this.buscarPorNombre(criterio);
  }

  // Verificar si existe un cliente
  public existe(id: number): boolean {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM Clientes WHERE ID = ?
    `);

    const result = stmt.get(id) as any;

    return result.count > 0;
  }
}