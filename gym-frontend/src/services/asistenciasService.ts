import { api } from './api';
import type { IAsistencia } from '../models/IAsistencia';

export const asistenciasService = {
    // Obtener todas las asistencias
    getAll: async (): Promise<IAsistencia[]> => {
        return api.get<IAsistencia[]>('/asistencias');
    },

    // Obtener asistencia por ID
    getById: async (id: number): Promise<IAsistencia> => {
        return api.get<IAsistencia>(`/asistencias/${id}`);
    },

    // Obtener asistencias por membresía
    getByMembresia: async (membresiaId: number): Promise<IAsistencia[]> => {
        return api.get<IAsistencia[]>(`/asistencias/membresia/${membresiaId}`);
    },

    // Obtener asistencias por fecha
    getByFecha: async (fecha: string): Promise<IAsistencia[]> => {
        return api.get<IAsistencia[]>(`/asistencias/fecha/${fecha}`);
    },

    // Registrar nueva asistencia
    create: async (membresiaId: number): Promise<{ success: boolean; id: number }> => {
        return api.post<{ success: boolean; id: number }>('/asistencias', { membresiaId });
    },

    // Eliminar asistencia
    delete: async (id: number): Promise<{ success: boolean }> => {
        return api.delete<{ success: boolean }>(`/asistencias/${id}`);
    },
};
