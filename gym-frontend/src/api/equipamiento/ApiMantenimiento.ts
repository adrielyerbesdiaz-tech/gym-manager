import { ApiBase } from '../base/ApiBase';
import type { IMantenimiento } from '../../models/IMantenimiento';

export class ApiMantenimiento {
    static async obtenerMantenimientos(): Promise<IMantenimiento[]> {
        return ApiBase.get('/mantenimiento');
    }

    static async obtenerMantenimientosPorEquipo(equipoId: number): Promise<IMantenimiento[]> {
        return ApiBase.get(`/mantenimiento/equipo/${equipoId}`);
    }

    static async crearMantenimiento(mantenimiento: Omit<IMantenimiento, 'mantenimientoId'>): Promise<IMantenimiento> {
        return ApiBase.post('/mantenimiento', mantenimiento);
    }

    static async actualizarMantenimiento(id: number, mantenimiento: Partial<IMantenimiento>): Promise<void> {
        await ApiBase.put(`/mantenimiento/${id}`, mantenimiento);
    }

    static async eliminarMantenimiento(id: number): Promise<void> {
        await ApiBase.delete(`/mantenimiento/${id}`);
    }
}
