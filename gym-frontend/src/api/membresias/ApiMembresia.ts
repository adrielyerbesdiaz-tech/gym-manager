import { ApiBase } from '../base/ApiBase';
import { transformMembresiaFromBackend } from '../base/Transformadores';

export class MembresiaApi {
  static async obtenerMembresiasCliente(clienteId: number): Promise<any[]> {
    const data = await ApiBase.get(`/membresias/cliente/${clienteId}`);
    return data.map(transformMembresiaFromBackend);
  }

  // Agregar más métodos según necesites
}