import { ApiBase } from '../base/ApiBase';

export class ApiTipoMembresia {
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
    return ApiBase.get('/tipos-membresia');
  }

  static async eliminarTipoMembresia(id: number): Promise<void> {
    await ApiBase.delete(`/tipos-membresia/${id}`);
  }
}