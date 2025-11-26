import { ApiBase } from '../ApiBase';

export class EquipamientoApi {
  static async obtenerEquipamiento(): Promise<any[]> {
    return ApiBase.get('/equipamiento');
  }

  static async crearEquipamiento(equipamientoData: any): Promise<{ id: number }> {
    return ApiBase.post('/equipamiento', equipamientoData);
  }

  static async actualizarEquipamiento(id: number, equipamientoData: any): Promise<void> {
    await ApiBase.put(`/equipamiento/${id}`, equipamientoData);
  }

  static async eliminarEquipamiento(id: number): Promise<void> {
    await ApiBase.delete(`/equipamiento/${id}`);
  }

  static async buscarEquipamiento(criterio: string): Promise<any[]> {
    const data = await ApiBase.get(`/equipamiento/buscar/${encodeURIComponent(criterio)}`);
    return data;
  }

  static async obtenerEquipamientoPorId(id: number): Promise<any> {
    return ApiBase.get(`/equipamiento/${id}`);
  }
}