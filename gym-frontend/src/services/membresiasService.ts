import { api } from './api';
import type { IMembresia } from '../models/IMembresia';

export const membresiasService = {
    // Obtener todas las membresías
    getAll: async (): Promise<IMembresia[]> => {
        return api.get<IMembresia[]>('/membresias');
    },

    // Obtener membresía por ID
    getById: async (id: number): Promise<IMembresia> => {
        return api.get<IMembresia>(`/membresias/${id}`);
    },

    // Obtener membresías por cliente
    getByCliente: async (clienteId: number): Promise<IMembresia[]> => {
        return api.get<IMembresia[]>(`/membresias/cliente/${clienteId}`);
    },

    // Crear nueva membresía
    create: async (membresia: {
        tipoMembresiaId: number;
        clienteId: number;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/membresias', membresia);
    },

    // Renovar membresía
    renovar: async (membresiaId: number): Promise<{ success: boolean }> => {
        return api.post<{ success: boolean }>(`/membresias/${membresiaId}/renovar`, {});
    },

    // Eliminar membresía
    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/membresias/${id}`);
    },
};
