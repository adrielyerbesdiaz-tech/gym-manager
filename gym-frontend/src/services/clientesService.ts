import { api } from './api';
import type { ICliente } from '../models/ICliente';

export const clientesService = {
    // Obtener todos los clientes
    getAll: async (): Promise<ICliente[]> => {
        return api.get<ICliente[]>('/clientes');
    },

    // Obtener cliente por ID
    getById: async (id: number): Promise<ICliente> => {
        return api.get<ICliente>(`/clientes/${id}`);
    },

    // Crear nuevo cliente
    create: async (cliente: {
        nombreCompleto: string;
        telefono: string;
        idTipoMembresia: number;
        notas?: string;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/clientes', cliente);
    },

    // Actualizar notas del cliente
    updateNotas: async (id: number, notas: string): Promise<{ success: boolean }> => {
        return api.patch<{ success: boolean }>(`/clientes/${id}/notas`, { notas });
    },

    // Actualizar teléfono del cliente
    updateTelefono: async (id: number, telefono: string): Promise<{ success: boolean }> => {
        return api.patch<{ success: boolean }>(`/clientes/${id}/telefono`, { telefono });
    },

    // Eliminar cliente
    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/clientes/${id}`);
    },
};
