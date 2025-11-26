import { Router } from 'express';
import { ServicioMantenimiento } from '../servicios/ServicioMantenimiento';

export function crearRouterMantenimiento(servicioMantenimiento: ServicioMantenimiento): Router {
    const router = Router();

    // Crear nuevo mantenimiento
    router.post('/', (req, res) => {
        try {
            const { equipoId, descripcion, fechaInicio, fechaFin, costo } = req.body;
            
            if (!equipoId || !descripcion) {
                res.status(400).json({ 
                    success: false, 
                    error: 'equipoId y descripcion son requeridos' 
                });
                return;
            }

            // Usar fechaInicio si se proporciona, de lo contrario fecha actual
            const fecha = fechaInicio ? new Date(fechaInicio) : new Date();
            const id = servicioMantenimiento.crear(
                Number(equipoId), 
                descripcion, 
                fecha
            );
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
            
            // Transformar los mantenimientos al formato esperado por el frontend
            const mantenimientosFormateados = mantenimientos.map(mant => ({
                mantenimientoId: mant.getMantenimientoId(),
                equipoId: mant.getIdEquipamiento(),
                descripcion: mant.getDescripcion(),
                fechaInicio: mant.getFechaMantenimiento().toISOString().split('T')[0],
                fechaFin: null, // Tu entidad actual no tiene fechaFin
                costo: 0 // Tu entidad actual no tiene costo
            }));
            
            res.json(mantenimientosFormateados);
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
            
            // Transformar resultados
            const resultadosFormateados = resultados.map(mant => ({
                mantenimientoId: mant.getMantenimientoId(),
                equipoId: mant.getIdEquipamiento(),
                descripcion: mant.getDescripcion(),
                fechaInicio: mant.getFechaMantenimiento().toISOString().split('T')[0],
                fechaFin: null,
                costo: 0
            }));
            
            res.json(resultadosFormateados);
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
            
            const resultadosFormateados = resultados.map(mant => ({
                mantenimientoId: mant.getMantenimientoId(),
                equipoId: mant.getIdEquipamiento(),
                descripcion: mant.getDescripcion(),
                fechaInicio: mant.getFechaMantenimiento().toISOString().split('T')[0],
                fechaFin: null,
                costo: 0
            }));
            
            res.json(resultadosFormateados);
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
            
            // Transformar resultado individual
            const mantenimientoFormateado = {
                mantenimientoId: resultado.getMantenimientoId(),
                equipoId: resultado.getIdEquipamiento(),
                descripcion: resultado.getDescripcion(),
                fechaInicio: resultado.getFechaMantenimiento().toISOString().split('T')[0],
                fechaFin: null,
                costo: 0
            };
            
            res.json(mantenimientoFormateado);
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
            const { equipoId, descripcion, fechaInicio, fechaFin, costo } = req.body;
            
            if (!equipoId || !descripcion) {
                res.status(400).json({ 
                    success: false, 
                    error: 'equipoId y descripcion son requeridos' 
                });
                return;
            }

            // Usar fechaInicio si se proporciona, de lo contrario mantener la existente
            let fecha: Date;
            if (fechaInicio) {
                fecha = new Date(fechaInicio);
            } else {
                // Obtener el mantenimiento existente para conservar su fecha
                const mantExistente = servicioMantenimiento.obtenerPorId(id);
                if (!mantExistente) {
                    res.status(404).json({ 
                        success: false, 
                        error: 'Mantenimiento no encontrado' 
                    });
                    return;
                }
                fecha = mantExistente.getFechaMantenimiento();
            }

            servicioMantenimiento.actualizar(
                id, 
                Number(equipoId), 
                fecha, 
                descripcion
            );
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