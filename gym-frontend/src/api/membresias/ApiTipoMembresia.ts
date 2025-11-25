import { ApiBase } from '../base/ApiBase';
import { transformTipoMembresiaFromBackend } from '../base/Transformadores';

export class TipoMembresiaApi {
  static async crearTipoMembresia(tipoMembresiaData: any): Promise<{ id: number }> {
    return ApiBase.post('/tipos-membresia', {
      nombre: tipoMembresiaData.nombre,
      duracionValor: tipoMembresiaData.duracionValor,
      duracionTipo: tipoMembresiaData.duracionTipo,
      precio: tipoMembresiaData.precio
    });
  }

  static async actualizarTipoMembresia(id: number, tipoMembresiaData: any): Promise<void> {
    await ApiBase.put(`/tipos-membresia/${id}`, {
      nombre: tipoMembresiaData.nombre,
      duracionValor: tipoMembresiaData.duracionValor,
      duracionTipo: tipoMembresiaData.duracionTipo,
      precio: tipoMembresiaData.precio
    });
  }

  static async obtenerTiposMembresia(): Promise<any[]> {
    const data = await ApiBase.get('/tipos-membresia');
    return data.map(transformTipoMembresiaFromBackend);
  }

  static async eliminarTipoMembresia(id: number): Promise<void> {
    await ApiBase.delete(`/tipos-membresia/${id}`);
  }
}