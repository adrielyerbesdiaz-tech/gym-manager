import { ApiBase } from '../base/ApiBase';
import type { IPago } from '../../models/IPago';

export class ApiPago {
    static async obtenerPagos(): Promise<IPago[]> {
        return ApiBase.get('/pagos');
    }

    static async crearPago(pago: Omit<IPago, 'pagoId'>): Promise<IPago> {
        return ApiBase.post('/pagos', pago);
    }

    static async obtenerPagosPorMembresia(membresiaId: number): Promise<IPago[]> {
        return ApiBase.get(`/pagos/membresia/${membresiaId}`);
    }
}
