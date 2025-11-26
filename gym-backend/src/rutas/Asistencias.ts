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

    // Obtener historial de asistencias de un cliente
    router.get('/cliente/:clienteId', (req, res) => {
        try {
            const clienteId = Number(req.params.clienteId);
            const historial = servicioAsistencia.obtenerHistorialCliente(clienteId);
            res.json(historial);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener asistencias por rango de fechas
    router.get('/rango-fechas', (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            if (!fechaInicio || !fechaFin) {
                res.status(400).json({ 
                    success: false, 
                    error: 'fechaInicio y fechaFin son requeridos como parámetros de consulta' 
                });
                return;
            }

            const asistencias = servicioAsistencia.obtenerAsistenciasPorFecha(
                fechaInicio as string, 
                fechaFin as string
            );
            res.json(asistencias);
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Contar asistencias de un cliente
    router.get('/cliente/:clienteId/contar', (req, res) => {
        try {
            const clienteId = Number(req.params.clienteId);
            const total = servicioAsistencia.contarAsistenciasCliente(clienteId);
            res.json({ 
                success: true, 
                clienteId,
                totalAsistencias: total 
            });
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Verificar si un cliente ya registró hoy
    router.get('/verificar/:clienteId', (req, res) => {
        try {
            const clienteId = Number(req.params.clienteId);
            const yaRegistro = servicioAsistencia.yaRegistroHoy(clienteId);
            res.json({ 
                success: true, 
                clienteId,
                yaRegistro 
            });
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar asistencia
    router.delete('/:asistenciaId', (req, res) => {
        try {
            const asistenciaId = Number(req.params.asistenciaId);
            servicioAsistencia.eliminarAsistencia(asistenciaId);
            res.json({ 
                success: true,
                message: 'Asistencia eliminada exitosamente' 
            });
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrada') ? 404 : 400;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener estadísticas de asistencias
    router.get('/estadisticas', (req, res) => {
        try {
            const estadisticas = servicioAsistencia.obtenerEstadisticas();
            res.json(estadisticas);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Generar reporte de asistencias con información del cliente
    router.get('/reporte', (req, res) => {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : undefined;
            const reporte = servicioAsistencia.generarReporteAsistencias(limite);
            res.json(reporte);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    return router;
}