import { Router } from 'express';
import { ServicioPago } from '../servicios/ServicioPago';

export function crearRouterPagos(servicioPago: ServicioPago): Router {
    const router = Router();

    // Registrar nuevo pago
    router.post('/', (req, res) => {
        try {
            const { membresiaID, monto } = req.body;
            
            if (!membresiaID || monto === undefined || monto === null) {
                res.status(400).json({ 
                    success: false, 
                    error: 'membresiaID y monto son requeridos' 
                });
                return;
            }

            const id = servicioPago.crear(Number(membresiaID), Number(monto));
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todos los pagos
    router.get('/', (req, res) => {
        try {
            const pagos = servicioPago.obtenerTodos();
            res.json(pagos);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener pago por ID
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = servicioPago.buscarPorId(id);
            res.json(resultado);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener historial de pagos para una membresía específica
    router.get('/membresia/:membresiaId', (req, res) => {
        try {
            const membresiaId = Number(req.params.membresiaId);
            const resultados = servicioPago.buscarPorMembresia(membresiaId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar pago
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioPago.eliminar(id);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    return router;
}