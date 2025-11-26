import { ApiBase } from '../base/ApiBase';
import type { IMembresia } from '../../models/IMembresia';

export class ApiMembresia {
  static async obtenerMembresias(): Promise<IMembresia[]> {
    return ApiBase.get('/membresias');
  }

  static async obtenerMembresiasCliente(clienteId: number): Promise<IMembresia[]> {
    return ApiBase.get(`/membresias/cliente/${clienteId}`);
  }

  static async crearMembresia(membresia: Omit<IMembresia, 'membresiaId'>): Promise<IMembresia> {
    return ApiBase.post('/membresias', membresia);
  }

  static async renovarMembresia(membresiaId: number, datosRenovacion: any): Promise<void> {
    await ApiBase.post(`/membresias/${membresiaId}/renovar`, datosRenovacion);
  }
}