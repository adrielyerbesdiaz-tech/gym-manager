import { Router } from 'express';
import { ServicioMembresia } from '../servicios/ServicioMembresia';

export function crearRouterMembresias(servicioMembresia: ServicioMembresia): Router {
    const router = Router();

    // Crear nueva membresía
    router.post('/', (req, res) => {
        try {
            const { tipoMembresiaID, usuarioID } = req.body;
            
            if (!tipoMembresiaID || !usuarioID) {
                 res.status(400).json({ 
                    success: false, 
                    error: 'tipoMembresiaID y usuarioID son requeridos' 
                });
                return;
            }

            const id = servicioMembresia.crear(Number(tipoMembresiaID), Number(usuarioID));
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todas las membresías
    router.get('/', (req, res) => {
        try {
            const membresias = servicioMembresia.obtenerTodos();
            res.json(membresias);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener membresía por ID
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = servicioMembresia.buscarPorId(id);
            res.json(resultado);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrada') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener historial de membresías de un usuario
    router.get('/usuario/:usuarioId', (req, res) => {
        try {
            const usuarioId = Number(req.params.usuarioId);
            const resultados = servicioMembresia.buscarPorUsuario(usuarioId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener membresías activas (todas o de un usuario específico)
    router.get('/activas', (req, res) => {
        try {
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
            const membresiasActivas = servicioMembresia.obtenerMembresiasActivas(usuarioId);
            res.json(membresiasActivas);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener membresías próximas a vencer
    router.get('/proximas-vencer', (req, res) => {
        try {
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
            const membresiasProximas = servicioMembresia.obtenerMembresiasProximasAVencer(usuarioId);
            res.json(membresiasProximas);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener membresías vencidas
    router.get('/vencidas', (req, res) => {
        try {
            const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
            const membresiasVencidas = servicioMembresia.obtenerMembresiasVencidas(usuarioId);
            res.json(membresiasVencidas);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Verificar si un usuario tiene membresía activa
    router.get('/usuario/:usuarioId/tiene-activa', (req, res) => {
        try {
            const usuarioId = Number(req.params.usuarioId);
            const tieneActiva = servicioMembresia.tieneMembresiaActiva(usuarioId);
            res.json({ tieneMembresiaActiva: tieneActiva });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Renovar una membresía
    router.post('/:id/renovar', (req, res) => {
        try {
            const membresiaId = Number(req.params.id);
            const { nuevoTipoMembresiaID } = req.body;
            
            const nuevaMembresiaId = servicioMembresia.renovar(
                membresiaId, 
                nuevoTipoMembresiaID
            );
            
            res.json({ 
                success: true, 
                id: nuevaMembresiaId,
                message: 'Membresía renovada exitosamente'
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener estado de una membresía específica
    router.get('/:id/estado', (req, res) => {
        try {
            const membresiaId = Number(req.params.id);
            const membresia = servicioMembresia.buscarPorId(membresiaId);
            
            const estado = {
                activa: membresia.estaActiva(),
                proximaAVencer: membresia.estaProximaAVencer(),
                vencida: membresia.estaVencida(),
                fechaInicio: membresia.getFechaInicio(),
                fechaVencimiento: membresia.getFechaVencimiento(),
                diasRestantes: Math.ceil((membresia.getFechaVencimiento().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            };
            
            res.json(estado);
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar membresía
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioMembresia.eliminar(id);
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