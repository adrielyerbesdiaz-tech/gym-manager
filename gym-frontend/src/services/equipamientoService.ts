import { api } from './api';
import type { IEquipamiento } from '../models/IEquipamiento';
import type { IEquipoAccesorio } from '../models/IEquipoAccesorio';
import type { IMantenimiento } from '../models/IMantenimiento';

// Servicio para Equipamiento
export const equipamientoService = {
    getAll: async (): Promise<IEquipamiento[]> => {
        return api.get<IEquipamiento[]>('/equipamiento');
    },

    getById: async (id: number): Promise<IEquipamiento> => {
        return api.get<IEquipamiento>(`/equipamiento/${id}`);
    },

    create: async (equipo: {
        nombre: string;
        tipo: string;
        imagenUrl?: string;
        descripcion?: string;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/equipamiento', equipo);
    },

    update: async (
        id: number,
        equipo: {
            imagenUrl?: string;
            descripcion?: string;
        }
    ): Promise<{ success: boolean }> => {
        return api.put<{ success: boolean }>(`/equipamiento/${id}`, equipo);
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/equipamiento/${id}`);
    },
};

// Servicio para Accesorios
export const accesoriosService = {
    getAll: async (): Promise<IEquipoAccesorio[]> => {
        return api.get<IEquipoAccesorio[]>('/accesorios');
    },

    getById: async (id: number): Promise<IEquipoAccesorio> => {
        return api.get<IEquipoAccesorio>(`/accesorios/${id}`);
    },

    create: async (accesorio: {
        nombre: string;
        cantidad: string;
        notas?: string;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/accesorios', accesorio);
    },

    update: async (
        id: number,
        accesorio: {
            cantidad?: string;
            notas?: string;
        }
    ): Promise<{ success: boolean }> => {
        return api.put<{ success: boolean }>(`/accesorios/${id}`, accesorio);
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/accesorios/${id}`);
    },
};

// Servicio para Mantenimientos
export const mantenimientosService = {
    getAll: async (): Promise<IMantenimiento[]> => {
        return api.get<IMantenimiento[]>('/mantenimientos');
    },

    getById: async (id: number): Promise<IMantenimiento> => {
        return api.get<IMantenimiento>(`/mantenimientos/${id}`);
    },

    getByEquipo: async (equipoId: number): Promise<IMantenimiento[]> => {
        return api.get<IMantenimiento[]>(`/mantenimientos/equipo/${equipoId}`);
    },

    create: async (mantenimiento: {
        equipoId: number;
        descripcion: string;
        costo: number;
        fechaInicio: string;
        fechaFin?: string;
    }): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/mantenimientos', mantenimiento);
    },

    finalizar: async (id: number): Promise<{ success: boolean }> => {
        return api.patch<{ success: boolean }>(`/mantenimientos/${id}/finalizar`, {});
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/mantenimientos/${id}`);
    },
};
