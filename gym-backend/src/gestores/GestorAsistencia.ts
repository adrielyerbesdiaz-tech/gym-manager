import Database from 'better-sqlite3';
import { asistencia } from '../entidades/asistencia';

export class GestorAsistencia {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  // Registrar una nueva asistencia
  public agregar(asistencia: asistencia): number {
    const stmt = this.db.prepare(`
      INSERT INTO Asistencias (ID_Cliente, Fecha_Check_In)
      VALUES (?, ?)
    `);

    const result = stmt.run(
      asistencia.getClienteID(),
      asistencia.getFechaCheckIn().toISOString()
    );

    return result.lastInsertRowid as number;
  }

  // Buscar asistencia por ID - AHORA CON DATOS CORRECTOS
  public buscarPorId(id: number): asistencia | null {
    const stmt = this.db.prepare(`
      SELECT * FROM Asistencias WHERE ID_Asistencia = ?
    `);

    const row = stmt.get(id) as any;

    if (!row) {
      return null;
    }

    // Ahora crea la instancia con los datos reales de la BD
    return new asistencia(
      row.ID_Cliente,
      row.ID_Asistencia,
      new Date(row.Fecha_Check_In)
    );
  }

  // Buscar todas las asistencias de un cliente - AHORA CON DATOS CORRECTOS
  public buscarPorCliente(clienteId: number): asistencia[] {
    const stmt = this.db.prepare(`
      SELECT * FROM Asistencias 
      WHERE ID_Cliente = ?
      ORDER BY Fecha_Check_In DESC
    `);

    const rows = stmt.all(clienteId) as any[];

    // Ahora cada instancia tiene el ID y fecha correctos de la BD
    return rows.map(row => new asistencia(
      row.ID_Cliente,
      row.ID_Asistencia,
      new Date(row.Fecha_Check_In)
    ));
  }

  // Obtener todas las asistencias (con límite opcional)
  public obtenerTodos(limite?: number): asistencia[] {
    const query = limite 
      ? `SELECT * FROM Asistencias ORDER BY Fecha_Check_In DESC LIMIT ?`
      : `SELECT * FROM Asistencias ORDER BY Fecha_Check_In DESC`;
    
    const stmt = this.db.prepare(query);
    
    const rows = (limite ? stmt.all(limite) : stmt.all()) as any[];

    // Ahora devuelve objetos asistencia con datos correctos
    return rows.map(row => new asistencia(
      row.ID_Cliente,
      row.ID_Asistencia,
      new Date(row.Fecha_Check_In)
    ));
  }

  // Obtener asistencias de hoy
  public obtenerAsistenciasHoy(): any[] {
    const stmt = this.db.prepare(`
      SELECT 
        a.ID_Asistencia,
        a.ID_Cliente,
        a.Fecha_Check_In,
        c.Nombre_Completo,
        c.Telefono
      FROM Asistencias a
      INNER JOIN Clientes c ON a.ID_Cliente = c.ID
      WHERE DATE(a.Fecha_Check_In) = DATE('now')
      ORDER BY a.Fecha_Check_In DESC
    `);

    return stmt.all() as any[];
  }

  // Obtener asistencias por rango de fechas
  public obtenerPorRangoFechas(fechaInicio: Date, fechaFin: Date): any[] {
    const stmt = this.db.prepare(`
      SELECT 
        a.ID_Asistencia,
        a.ID_Cliente,
        a.Fecha_Check_In,
        c.Nombre_Completo,
        c.Telefono
      FROM Asistencias a
      INNER JOIN Clientes c ON a.ID_Cliente = c.ID
      WHERE DATE(a.Fecha_Check_In) BETWEEN DATE(?) AND DATE(?)
      ORDER BY a.Fecha_Check_In DESC
    `);

    return stmt.all(
      fechaInicio.toISOString().split('T')[0],
      fechaFin.toISOString().split('T')[0]
    ) as any[];
  }

  // Contar asistencias de un cliente
  public contarPorCliente(clienteId: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM Asistencias WHERE ID_Cliente = ?
    `);

    const result = stmt.get(clienteId) as any;

    return result.count;
  }

  // Verificar si un cliente ya registró asistencia hoy
  public yaRegistroHoy(clienteId: number): boolean {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM Asistencias 
      WHERE ID_Cliente = ? 
      AND DATE(Fecha_Check_In) = DATE('now')
    `);

    const result = stmt.get(clienteId) as any;

    return result.count > 0;
  }

  // Eliminar asistencia por ID
  public eliminar(id: number): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM Asistencias WHERE ID_Asistencia = ?
    `);

    const result = stmt.run(id);

    return result.changes > 0;
  }

  // Obtener estadísticas de asistencias
  public obtenerEstadisticas() {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total_asistencias,
        COUNT(DISTINCT ID_Cliente) as clientes_unicos,
        DATE(Fecha_Check_In) as fecha
      FROM Asistencias
      WHERE DATE(Fecha_Check_In) >= DATE('now', '-30 days')
      GROUP BY DATE(Fecha_Check_In)
      ORDER BY fecha DESC
    `);

    return stmt.all() as any[];
  }
}