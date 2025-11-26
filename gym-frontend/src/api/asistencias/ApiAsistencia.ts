import { ApiBase } from '../base/ApiBase';

export class ApiAsistencia {
  static async registrarAsistencia(clienteId: number): Promise<any> {
    return ApiBase.post('/asistencias', { clienteId });
  }

  static async verificarAsistenciaHoy(clienteId: number): Promise<boolean> {
    try {
      // Backend endpoint /asistencias/verificar/:id is missing.
      // We fetch all attendances for today and check if the client is in the list.
      const asistenciasHoy = await this.obtenerAsistenciasHoy();
      // asistenciasHoy is an array of objects with ID_Cliente
      return asistenciasHoy.some((a: any) => a.ID_Cliente === clienteId);
    } catch (error) {
      console.error('Error verificando asistencia hoy:', error);
      return false;
    }
  }

  static async obtenerAsistenciasHoy(): Promise<any[]> {
    return ApiBase.get('/asistencias/hoy');
  }

  static async obtenerAsistenciasCliente(clienteId: number): Promise<any[]> {
    return ApiBase.get(`/asistencias/cliente/${clienteId}`);
  }

  static async obtenerTodasLasAsistencias(): Promise<any[]> {
    return ApiBase.get('/asistencias');
  }

  static async obtenerEstadisticasAsistencias(): Promise<any> {
    return ApiBase.get('/asistencias/estadisticas');
  }
}