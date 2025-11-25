import Database from 'better-sqlite3';
import { tipoMembresia } from '../entidades/tipoMembresia';

export class GestorTipoMembresia {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  // Agregar un nuevo tipo de membresía
  public agregar(tipo: tipoMembresia): number {
    const stmt = this.db.prepare(`
      INSERT INTO Tipos_Membresia (Nombre, Duracion_Valor, Duracion_Tipo, Precio)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      tipo.getNombre(),
      tipo.getDuracionValor(),
      tipo.getDuracionTipo(),
      tipo.getPrecio()
    );

    return result.lastInsertRowid as number;
  }

  // Buscar tipo de membresía por ID
  public buscarPorId(id: number): tipoMembresia | null {
    const stmt = this.db.prepare(`
      SELECT * FROM Tipos_Membresia WHERE ID = ?
    `);

    const row = stmt.get(id) as any;

    if (!row) {
      return null;
    }

    return new tipoMembresia(
      row.Nombre,
      row.Duracion_Valor,
      row.Duracion_Tipo,
      row.Precio,
      row.ID
    );
  }

  // Buscar tipos de membresía por nombre
  public buscarPorNombre(nombre: string): tipoMembresia[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Tipos_Membresia 
      WHERE Nombre LIKE ?
      ORDER BY Nombre
    `);

    const rows = stmt.all(`%${nombre}%`) as any[];

    return rows.map(row => new tipoMembresia(
      row.Nombre,
      row.Duracion_Valor,
      row.Duracion_Tipo,
      row.Precio,
      row.ID
    ));
  }

  // Obtener todos los tipos de membresía
  public obtenerTodos(): tipoMembresia[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Tipos_Membresia ORDER BY Nombre
    `);

    const rows = stmt.all() as any[];

    return rows.map(row => new tipoMembresia(
      row.Nombre,
      row.Duracion_Valor,
      row.Duracion_Tipo,
      row.Precio,
      row.ID
    ));
  }

  // Actualizar tipo de membresía
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

  // Actualizar solo el precio
  public actualizarPrecio(id: number, precio: number): boolean {
    const stmt = this.db.prepare(`
      UPDATE Tipos_Membresia SET Precio = ? WHERE ID = ?
    `);

    const result = stmt.run(precio, id);

    return result.changes > 0;
  }

  // Actualizar solo el nombre
  public actualizarNombre(id: number, nombre: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE Tipos_Membresia SET Nombre = ? WHERE ID = ?
    `);

    const result = stmt.run(nombre, id);

    return result.changes > 0;
  }

  // Actualizar solo la duración
  public actualizarDuracion(id: number, duracionValor: number, duracionTipo: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE Tipos_Membresia SET Duracion_Valor = ?, Duracion_Tipo = ? WHERE ID = ?
    `);

    const result = stmt.run(duracionValor, duracionTipo, id);

    return result.changes > 0;
  }

  // Eliminar tipo de membresía
  public eliminar(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM Tipos_Membresia WHERE ID = ?
    `);

    const result = stmt.run(id);

    return result.changes > 0;
  }

  // Verificar si existe un tipo de membresía
  public existe(id: number): boolean {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM Tipos_Membresia WHERE ID = ?
    `);

    const result = stmt.get(id) as any;

    return result.count > 0;
  }

  // Verificar si un tipo de membresía está siendo usado
  public estaEnUso(id: number): boolean {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM Membresias WHERE ID_Tipo = ?
    `);

    const result = stmt.get(id) as any;

    return result.count > 0;
  }

  // Obtener tipos de membresía ordenados por precio
  public obtenerPorPrecio(ascendente: boolean = true): tipoMembresia[] {
    const orden = ascendente ? 'ASC' : 'DESC';
    const stmt = this.db.prepare(`
      SELECT * FROM Tipos_Membresia ORDER BY Precio ${orden}
    `);

    const rows = stmt.all() as any[];

    return rows.map(row => new tipoMembresia(
      row.Nombre,
      row.Duracion_Valor,
      row.Duracion_Tipo,
      row.Precio,
      row.ID
    ));
  }

  // Obtener tipos por tipo de duración (dias, semanas, meses)
  public obtenerPorTipoDuracion(duracionTipo: string): tipoMembresia[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Tipos_Membresia 
      WHERE Duracion_Tipo = ?
      ORDER BY Duracion_Valor
    `);

    const rows = stmt.all(duracionTipo) as any[];

    return rows.map(row => new tipoMembresia(
      row.Nombre,
      row.Duracion_Valor,
      row.Duracion_Tipo,
      row.Precio,
      row.ID
    ));
  }
}