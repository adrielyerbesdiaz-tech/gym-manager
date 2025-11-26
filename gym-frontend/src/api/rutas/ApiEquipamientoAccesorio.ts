import { ApiBase } from '../ApiBase';

export class EquipamientoAccesorioApi {
  static async obtenerAccesorios(): Promise<any[]> {
    return ApiBase.get('/accesorios');
  }

  static async crearAccesorio(accesorioData: any): Promise<{ id: number }> {
    return ApiBase.post('/accesorios', accesorioData);
  }

  static async obtenerAccesorioPorId(id: number): Promise<any> {
    return ApiBase.get(`/accesorios/${id}`);
  }

  static async obtenerAccesoriosPorEquipo(equipoId: number): Promise<any[]> {
    return ApiBase.get(`/accesorios/equipo/${equipoId}`);
  }

  static async actualizarNotasAccesorio(id: number, notas: string): Promise<void> {
    await ApiBase.patch(`/accesorios/${id}/notas`, { notas });
  }

  static async eliminarAccesorio(id: number): Promise<void> {
    await ApiBase.delete(`/accesorios/${id}`);
  }

  static async actualizarAccesorio(id: number, accesorioData: any): Promise<void> {
  await ApiBase.put(`/accesorios/${id}`, accesorioData);
}
}