import { ApiBase } from '../ApiBase';
import { transformMembresiaFromBackend } from '../Transformadores';

export class MembresiaApi {
  static async crearMembresia(membresiaData: any): Promise<{ id: number }> {
    return ApiBase.post('/membresias', {
      tipoMembresiaID: membresiaData.tipoMembresiaID,
      usuarioID: membresiaData.usuarioID
    });
  }

  static async obtenerMembresias(): Promise<any[]> {
    const data = await ApiBase.get('/membresias');
    return data.map(transformMembresiaFromBackend);
  }

  static async obtenerMembresiaPorId(id: number): Promise<any> {
    const data = await ApiBase.get(`/membresias/${id}`);
    return transformMembresiaFromBackend(data);
  }

  static async obtenerMembresiasPorUsuario(usuarioId: number): Promise<any[]> {
    const data = await ApiBase.get(`/membresias/usuario/${usuarioId}`);
    return data.map(transformMembresiaFromBackend);
  }

  static async obtenerMembresiasActivas(usuarioId?: number): Promise<any[]> {
    const query = usuarioId ? `?usuarioId=${usuarioId}` : '';
    const data = await ApiBase.get(`/membresias/activas${query}`);
    return data.map(transformMembresiaFromBackend);
  }

  static async tieneMembresiaActiva(usuarioId: number): Promise<boolean> {
    const data = await ApiBase.get(`/membresias/usuario/${usuarioId}/tiene-activa`);
    return data.tieneMembresiaActiva;
  }

  static async renovarMembresia(membresiaId: number, nuevoTipoMembresiaID: number): Promise<{ id: number }> {
    return ApiBase.post(`/membresias/${membresiaId}/renovar`, { nuevoTipoMembresiaID });
  }

  static async eliminarMembresia(id: number): Promise<void> {
    await ApiBase.delete(`/membresias/${id}`);
  }
}