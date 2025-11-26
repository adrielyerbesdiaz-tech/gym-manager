import { Router } from 'express';
import { ServicioEquipamientoAccesorio } from '../servicios/ServicioEquipamientoAccesorio';

export function crearRouterAccesorios(servicioEquipamientoAccesorio: ServicioEquipamientoAccesorio): Router {
    const router = Router();

    // Crear nuevo accesorio
    router.post('/', (req, res) => {
        try {
            const { equipoId, nombre, notas } = req.body;
            
            if (!equipoId || !nombre) {
                res.status(400).json({ 
                    success: false, 
                    error: 'equipoId y nombre son requeridos' 
                });
                return;
            }

            const id = servicioEquipamientoAccesorio.crear(Number(equipoId), nombre, notas);
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todos los accesorios
    router.get('/', (req, res) => {
        try {
            const accesorios = servicioEquipamientoAccesorio.obtenerTodos();
            res.json(accesorios);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener accesorio por ID
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = servicioEquipamientoAccesorio.buscarPorId(id);
            res.json(resultado);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener accesorios por ID de Equipo
    router.get('/equipo/:equipoId', (req, res) => {
        try {
            const equipoId = Number(req.params.equipoId);
            const resultados = servicioEquipamientoAccesorio.buscarPorEquipo(equipoId);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar notas/descripción del accesorio
    router.patch('/:id/notas', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { notas } = req.body;
            
            if (notas === undefined) {
                res.status(400).json({ 
                    success: false, 
                    error: 'notas es requerido' 
                });
                return;
            }

            servicioEquipamientoAccesorio.actualizarNotas(id, notas);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar accesorio
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioEquipamientoAccesorio.eliminar(id);
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