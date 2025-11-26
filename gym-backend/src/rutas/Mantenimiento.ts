import { Router } from 'express';
import { ServicioMantenimiento } from '../servicios/ServicioMantenimiento';

export function crearRouterMantenimiento(servicioMantenimiento: ServicioMantenimiento): Router {
    const router = Router();

    // Registrar nuevo mantenimiento
    router.post('/', (req, res) => {
        try {
            const { tipo } = req.body;
            const id = servicioMantenimiento.crear(tipo);
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

    // Buscar mantenimiento por ID o Tipo
    router.get('/buscar/:criterio', (req, res) => {
        try {
            const criterio = isNaN(Number(req.params.criterio)) 
                ? req.params.criterio 
                : Number(req.params.criterio);
            
            const resultados = servicioMantenimiento.buscar(criterio);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener mantenimiento por ID específico
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultados = servicioMantenimiento.buscar(id);
            
            if (resultados.length === 0) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Mantenimiento no encontrado' 
                });
                return;
            }
            
            res.json(resultados[0]);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar registro de mantenimiento
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