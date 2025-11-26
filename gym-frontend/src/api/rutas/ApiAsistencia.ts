import { ApiBase } from '../ApiBase';
import { transformAsistenciaFromBackend } from '../Transformadores';

export class AsistenciaApi {
  static async registrarAsistencia(clienteId: number): Promise<{ success: boolean; id: number; message: string }> {
    return ApiBase.post('/asistencias', { clienteId });
  }

  static async obtenerAsistenciasHoy(): Promise<any[]> {
    return ApiBase.get('/asistencias/hoy');
  }

  static async obtenerHistorialCliente(clienteId: number): Promise<any[]> {
    const data = await ApiBase.get(`/asistencias/cliente/${clienteId}`);
    return data.map(transformAsistenciaFromBackend);
  }

  static async obtenerAsistenciasPorFecha(fechaInicio: string, fechaFin: string): Promise<any[]> {
    const data = await ApiBase.get(`/asistencias/rango-fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return data.map(transformAsistenciaFromBackend);
  }

  static async contarAsistenciasCliente(clienteId: number): Promise<{ totalAsistencias: number }> {
    return ApiBase.get(`/asistencias/cliente/${clienteId}/contar`);
  }

  static async verificarAsistenciaHoy(clienteId: number): Promise<{ yaRegistro: boolean }> {
    return ApiBase.get(`/asistencias/verificar/${clienteId}`);
  }

  static async eliminarAsistencia(asistenciaId: number): Promise<void> {
    await ApiBase.delete(`/asistencias/${asistenciaId}`);
  }

  static async obtenerEstadisticas(): Promise<any> {
    return ApiBase.get('/asistencias/estadisticas');
  }

  static async generarReporteAsistencias(limite?: number): Promise<any[]> {
    const query = limite ? `?limite=${limite}` : '';
    return ApiBase.get(`/asistencias/reporte${query}`);
  }
}