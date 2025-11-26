import { ApiBase } from '../base/ApiBase';

export class ApiCliente {
  static async obtenerClientes(): Promise<any[]> {
    return ApiBase.get('/clientes');
  }

  static async buscarClientes(criterio: string): Promise<any[]> {
    if (!criterio.trim()) return [];
    return ApiBase.get(`/clientes/buscar/${encodeURIComponent(criterio)}`);
  }

  static async buscarClientePorTelefono(telefono: string): Promise<any | null> {
    try {
      return await ApiBase.get(`/clientes/telefono/${encodeURIComponent(telefono)}`);
    } catch (error) {
      console.error('Error buscando cliente por teléfono:', error);

      // Fallback
      try {
        const clientes = await this.buscarClientes(telefono);
        // Backend returns 'telefono' as number
        const clienteExacto = clientes.find((cliente: any) =>
          cliente.telefono === Number(telefono)
        );
        return clienteExacto || null;
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        return null;
      }
    }
  }

  static async crearCliente(clienteData: any): Promise<{ id: number }> {
    return ApiBase.post('/clientes', {
      nombre: clienteData.nombreCompleto,
      telefono: clienteData.telefono,
      notas: clienteData.notas || ''
    });
  }

  static async actualizarClienteNotas(id: number, notas: string): Promise<void> {
    await ApiBase.patch(`/clientes/${id}/notas`, { notas });
  }

  static async actualizarClienteTelefono(id: number, telefono: string): Promise<void> {
    await ApiBase.patch(`/clientes/${id}/telefono`, { telefono });
  }

  static async actualizarCliente(id: number, clienteData: any): Promise<void> {
    await ApiBase.put(`/clientes/${id}`, {
      nombre: clienteData.nombreCompleto,
      telefono: clienteData.telefono,
      notas: clienteData.notas || ''
    });
  }

  static async eliminarCliente(id: number): Promise<void> {
    await ApiBase.delete(`/clientes/${id}`);
  }
}