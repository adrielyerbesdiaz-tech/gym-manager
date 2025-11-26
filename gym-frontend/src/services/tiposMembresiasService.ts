import { api } from './api';
import type { ITipoMembresia } from '../models/ITipoMembresia';

export const tiposMembresiasService = {
    // Obtener todos los tipos de membresía
    getAll: async (): Promise<ITipoMembresia[]> => {
        return api.get<ITipoMembresia[]>('/tipos-membresia');
    },

    // Obtener tipo de membresía por ID
    getById: async (id: number): Promise<ITipoMembresia> => {
        return api.get<ITipoMembresia>(`/tipos-membresia/${id}`);
    },

    // Crear nuevo tipo de membresía
    create: async (tipo: {
        nombre: string;
        duracionDias: number;
        precio: number;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/tipos-membresia', tipo);
    },

    // Actualizar tipo de membresía
    update: async (
        id: number,
        tipo: {
            nombre?: string;
            duracionDias?: number;
            precio?: number;
        }
    ): Promise<{ success: boolean }> => {
        return api.put<{ success: boolean }>(`/tipos-membresia/${id}`, tipo);
    },

    // Eliminar tipo de membresía
    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/tipos-membresia/${id}`);
    },
};
