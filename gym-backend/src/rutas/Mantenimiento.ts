import { Router } from 'express';
import { ServicioMantenimiento } from '../servicios/ServicioMantenimiento';

export function crearRouterMantenimiento(servicioMantenimiento: ServicioMantenimiento): Router {
    const router = Router();

    // Crear nuevo mantenimiento
    router.post('/', (req, res) => {
        try {
            const { equipoId, descripcion, fechaMantenimiento } = req.body;
            
            if (!equipoId || !descripcion) {
                res.status(400).json({ 
                    success: false, 
                    error: 'equipoId y descripcion son requeridos' 
                });
                return;
            }

            const fecha = fechaMantenimiento ? new Date(fechaMantenimiento) : new Date();
            const id = servicioMantenimiento.crear(Number(equipoId), descripcion, fecha);
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todos los mantenimientos
    router.get('/', (req, res) => {
        try {
            const mantenimientos = servicioMantenimiento.obtenerTodos();
            res.json(mantenimientos);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Buscar mantenimientos por criterio
    router.get('/buscar/:criterio', (req, res) => {
        try {
            const criterio = req.params.criterio;
            const resultados = servicioMantenimiento.buscar(criterio);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener mantenimientos por equipo
    router.get('/equipo/:equipoId', (req, res) => {
        try {
            const equipoId = Number(req.params.equipoId);
            const resultados = servicioMantenimiento.buscarPorEquipo(equipoId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener mantenimiento por ID
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = servicioMantenimiento.obtenerPorId(id);
            
            if (!resultado) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Mantenimiento no encontrado' 
                });
                return;
            }
            
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar mantenimiento
    router.put('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { equipoId, descripcion, fechaMantenimiento } = req.body;
            
            if (!equipoId || !descripcion) {
                res.status(400).json({ 
                    success: false, 
                    error: 'equipoId y descripcion son requeridos' 
                });
                return;
            }

            const fecha = fechaMantenimiento ? new Date(fechaMantenimiento) : new Date();
            servicioMantenimiento.actualizar(id, Number(equipoId), fecha, descripcion);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar mantenimiento
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioMantenimiento.eliminar(id);
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