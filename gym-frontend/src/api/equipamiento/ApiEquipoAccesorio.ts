import { ApiBase } from '../base/ApiBase';
import type { IEquipoAccesorio } from '../../models/IEquipoAccesorio';

export class ApiEquipoAccesorio {
    static async obtenerAccesorios(): Promise<IEquipoAccesorio[]> {
        return ApiBase.get('/accesorios');
    }

    static async crearAccesorio(accesorio: Omit<IEquipoAccesorio, 'accesorioId'>): Promise<IEquipoAccesorio> {
        return ApiBase.post('/accesorios', accesorio);
    }

    static async actualizarAccesorio(id: number, accesorio: Partial<IEquipoAccesorio>): Promise<void> {
        await ApiBase.put(`/accesorios/${id}`, accesorio);
    }

    static async eliminarAccesorio(id: number): Promise<void> {
        await ApiBase.delete(`/accesorios/${id}`);
    }
}
