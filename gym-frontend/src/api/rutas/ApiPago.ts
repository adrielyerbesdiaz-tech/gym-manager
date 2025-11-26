import { ApiBase } from '../ApiBase';

export class PagoApi {
  static async obtenerPagos(): Promise<any[]> {
    return ApiBase.get('/pagos');
  }

  static async crearPago(pagoData: any): Promise<{ id: number }> {
    return ApiBase.post('/pagos', pagoData);
  }

  static async obtenerPagoPorId(id: number): Promise<any> {
    return ApiBase.get(`/pagos/${id}`);
  }

  static async obtenerPagosPorMembresia(membresiaId: number): Promise<any[]> {
    return ApiBase.get(`/pagos/membresia/${membresiaId}`);
  }

  static async eliminarPago(id: number): Promise<void> {
    await ApiBase.delete(`/pagos/${id}`);
  }
}