import { ApiBase } from '../base/ApiBase';
import { transformAsistenciaFromBackend } from '../base/Transformadores';

export class AsistenciaApi {
  static async registrarAsistencia(clienteId: number): Promise<any> {
    return ApiBase.post('/asistencias', { clienteId });
  }

  static async verificarAsistenciaHoy(clienteId: number): Promise<boolean> {
    const data = await ApiBase.get(`/asistencias/verificar/${clienteId}`);
    return data.yaRegistro;
  }

  static async obtenerAsistenciasHoy(): Promise<any[]> {
    return ApiBase.get('/asistencias/hoy');
  }

  static async obtenerAsistenciasCliente(clienteId: number): Promise<any[]> {
    return ApiBase.get(`/asistencias/cliente/${clienteId}`);
  }

  static async obtenerTodasLasAsistencias(): Promise<any[]> {
    const data = await ApiBase.get('/asistencias');
    return data.map(transformAsistenciaFromBackend);
  }

  static async obtenerEstadisticasAsistencias(): Promise<any> {
    return ApiBase.get('/asistencias/estadisticas');
  }
}