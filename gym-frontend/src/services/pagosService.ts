import { api } from './api';
import type { IPago } from '../models/IPago';

export const pagosService = {
    // Obtener todos los pagos
    getAll: async (): Promise<IPago[]> => {
        return api.get<IPago[]>('/pagos');
    },

    // Obtener pago por ID
    getById: async (id: number): Promise<IPago> => {
        return api.get<IPago>(`/pagos/${id}`);
    },

    // Obtener pagos por membresía
    getByMembresia: async (membresiaId: number): Promise<IPago[]> => {
        return api.get<IPago[]>(`/pagos/membresia/${membresiaId}`);
    },

    // Registrar nuevo pago
    create: async (pago: {
        membresiaId: number;
        monto: number;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/pagos', pago);
    },

    // Eliminar pago
    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/pagos/${id}`);
    },
};
