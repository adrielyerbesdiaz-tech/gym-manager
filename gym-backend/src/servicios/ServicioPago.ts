import { pago } from '../entidades/Pago';
import { GestorPago } from '../gestores/GestorPago';

export class ServicioPago {
    private readonly gestorPago: GestorPago;

    constructor(gestorPago: GestorPago) {
        this.gestorPago = gestorPago;
    }

    public crear(membresiaID: number, monto: number): number {
        // Validaciones
        if (!membresiaID || membresiaID <= 0) {
            throw new Error('El ID de la membresía es obligatorio y debe ser positivo.');
        }
        if (monto <= 0) {
            throw new Error('El monto del pago debe ser positivo.');
        }
        
        // Nota: En una aplicación real, se debería verificar que la membresíaID exista.

        const nuevoPago = new pago(membresiaID, monto);
        
        return this.gestorPago.agregar(nuevoPago);
    }

    public obtenerTodos(): pago[] {
        return this.gestorPago.obtenerTodos();
    }

    public buscarPorId(id: number): pago {
        const resultado = this.gestorPago.buscarPorId(id);
        if (!resultado) {
            throw new Error('Pago no encontrado.');
        }
        return resultado;
    }

    public buscarPorMembresia(membresiaId: number): pago[] {
        if (!membresiaId || membresiaId <= 0) return [];
        return this.gestorPago.buscarPorMembresiaId(membresiaId);
    }

    public eliminar(id: number): void {
        const existe = this.gestorPago.buscarPorId(id);
        if (!existe) {
            throw new Error('Pago no encontrado.');
        }
        
        const eliminado = this.gestorPago.eliminar(id);
        if (!eliminado) {
            throw new Error('Error al eliminar el pago.');
        }
    }
}