import { Router } from 'express';
import { ServicioEquipamiento } from '../servicios/ServicioEquipamiento';

export function crearRouterEquipamiento(servicioEquipamiento: ServicioEquipamiento): Router {
    const router = Router();

    // Crear nuevo equipamiento
    router.post('/', (req, res) => {
        try {
            const { nombre, tipo, imagenUrl, descripcion } = req.body;
            const id = servicioEquipamiento.crear(nombre, tipo, imagenUrl, descripcion);
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todo el equipamiento
    router.get('/', (req, res) => {
        try {
            const equipos = servicioEquipamiento.obtenerTodos();
            res.json(equipos);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Buscar equipamiento por ID o Nombre
    router.get('/buscar/:criterio', (req, res) => {
        try {
            const criterio = isNaN(Number(req.params.criterio)) 
                ? req.params.criterio 
                : Number(req.params.criterio);
            
            const resultados = servicioEquipamiento.buscar(criterio);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener equipamiento por ID específico
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultados = servicioEquipamiento.buscar(id);
            
            if (resultados.length === 0) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Equipamiento no encontrado' 
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

    // Actualizar equipamiento
    router.put('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { nombre, tipo, imagenUrl, descripcion } = req.body;
            
            servicioEquipamiento.actualizar(id, nombre, tipo, imagenUrl, descripcion);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar equipamiento
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioEquipamiento.eliminar(id);
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