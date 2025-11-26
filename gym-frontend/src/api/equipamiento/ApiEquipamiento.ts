import { ApiBase } from '../base/ApiBase';
import type { IEquipamiento } from '../../models/IEquipamiento';

export class ApiEquipamiento {
    static async obtenerEquipos(): Promise<IEquipamiento[]> {
        return ApiBase.get('/equipamiento');
    }

    static async crearEquipo(equipo: Omit<IEquipamiento, 'equipoId'>): Promise<IEquipamiento> {
        return ApiBase.post('/equipamiento', equipo);
    }

    static async actualizarEquipo(id: number, equipo: Partial<IEquipamiento>): Promise<void> {
        await ApiBase.put(`/equipamiento/${id}`, equipo);
    }

    static async eliminarEquipo(id: number): Promise<void> {
        await ApiBase.delete(`/equipamiento/${id}`);
    }
}
