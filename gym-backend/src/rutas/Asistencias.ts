import { Router } from 'express';
import { ServicioAsistencia } from '../servicios/ServicioAsistencia';

export function crearRouterAsistencias(servicioAsistencia: ServicioAsistencia): Router {
    const router = Router();

    // Registrar asistencia
    router.post('/', (req, res) => {
        try {
            const { clienteId } = req.body;
            
            if (!clienteId) {
                res.status(400).json({ 
                    success: false, 
                    error: 'clienteId es requerido' 
                });
                return;
            }

            const id = servicioAsistencia.registrarAsistencia(Number(clienteId));
            res.json({ 
                success: true, 
                id,
                message: 'Asistencia registrada exitosamente' 
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener asistencias de hoy
    router.get('/hoy', (req, res) => {
        try {
            const asistencias = servicioAsistencia.obtenerAsistenciasHoy();
            res.json(asistencias);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // ... continuar con los demás endpoints de asistencias

    return router;
}