import { ApiBase } from '../ApiBase';

export class MantenimientoApi {
  static async obtenerMantenimientos(): Promise<any[]> {
    return ApiBase.get('/mantenimiento');
  }

  static async crearMantenimiento(tipo: string): Promise<{ id: number }> {
    return ApiBase.post('/mantenimiento', { tipo });
  }

  static async buscarMantenimiento(criterio: string): Promise<any[]> {
    const data = await ApiBase.get(`/mantenimiento/buscar/${encodeURIComponent(criterio)}`);
    return data;
  }

  static async obtenerMantenimientoPorId(id: number): Promise<any> {
    return ApiBase.get(`/mantenimiento/${id}`);
  }

  static async eliminarMantenimiento(id: number): Promise<void> {
    await ApiBase.delete(`/mantenimiento/${id}`);
  }
}