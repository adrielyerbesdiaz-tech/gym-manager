import { Router } from 'express';
import { ServicioTipoMembresia } from '../servicios/ServicioTipoMembresia';

export function crearRouterTiposMembresia(servicioTipoMembresia: ServicioTipoMembresia): Router {
    const router = Router();

    // Crear nuevo tipo de membresía
    router.post('/', (req, res) => {
        try {
            const { nombre, duracionValor, duracionTipo, precio } = req.body;
            
            if (!nombre || duracionValor === undefined || !duracionTipo || precio === undefined) {
                res.status(400).json({ 
                    success: false, 
                    error: 'Todos los campos son requeridos: nombre, duracionValor, duracionTipo, precio' 
                });
                return;
            }

            const id = servicioTipoMembresia.crear(nombre, duracionValor, duracionTipo, precio);
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todos los tipos de membresía
    router.get('/', (req, res) => {
        try {
            const tipos = servicioTipoMembresia.obtenerTodos();
            res.json(tipos);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Buscar tipos de membresía (por ID o nombre)
    router.get('/buscar/:criterio', (req, res) => {
        try {
            const criterio = isNaN(Number(req.params.criterio)) 
                ? req.params.criterio 
                : Number(req.params.criterio);
            
            const resultados = servicioTipoMembresia.buscar(criterio);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener tipo de membresía por ID específico
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultados = servicioTipoMembresia.buscar(id);
            
            if (resultados.length === 0) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Tipo de membresía no encontrado' 
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

    // Obtener tipos de membresía ordenados por precio
    router.get('/ordenar/precio', (req, res) => {
        try {
            const ascendente = req.query.ascendente !== 'false';
            const tipos = servicioTipoMembresia.obtenerPorPrecio(ascendente);
            res.json(tipos);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener tipos de membresía por tipo de duración
    router.get('/duracion/:tipo', (req, res) => {
        try {
            const duracionTipo = req.params.tipo;
            const tipos = servicioTipoMembresia.obtenerPorTipoDuracion(duracionTipo);
            res.json(tipos);
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Calcular fecha de vencimiento
    router.post('/:id/calcular-vencimiento', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { fechaInicio } = req.body;
            
            if (!fechaInicio) {
                res.status(400).json({ 
                    success: false, 
                    error: 'fechaInicio es requerida' 
                });
                return;
            }

            const fechaVencimiento = servicioTipoMembresia.calcularFechaVencimiento(
                id, 
                new Date(fechaInicio)
            );
            
            res.json({ 
                success: true, 
                fechaVencimiento: fechaVencimiento.toISOString() 
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar tipo de membresía completo
    router.put('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { nombre, duracionValor, duracionTipo, precio } = req.body;
            
            if (!nombre || duracionValor === undefined || !duracionTipo || precio === undefined) {
                res.status(400).json({ 
                    success: false, 
                    error: 'Todos los campos son requeridos: nombre, duracionValor, duracionTipo, precio' 
                });
                return;
            }

            servicioTipoMembresia.actualizar(id, nombre, duracionValor, duracionTipo, precio);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar solo el precio
    router.patch('/:id/precio', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { precio } = req.body;
            
            if (precio === undefined) {
                res.status(400).json({ 
                    success: false, 
                    error: 'precio es requerido' 
                });
                return;
            }

            servicioTipoMembresia.actualizarPrecio(id, precio);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar solo el nombre
    router.patch('/:id/nombre', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { nombre } = req.body;
            
            if (!nombre) {
                res.status(400).json({ 
                    success: false, 
                    error: 'nombre es requerido' 
                });
                return;
            }

            servicioTipoMembresia.actualizarNombre(id, nombre);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar solo la duración
    router.patch('/:id/duracion', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { duracionValor, duracionTipo } = req.body;
            
            if (duracionValor === undefined || !duracionTipo) {
                res.status(400).json({ 
                    success: false, 
                    error: 'duracionValor y duracionTipo son requeridos' 
                });
                return;
            }

            servicioTipoMembresia.actualizarDuracion(id, duracionValor, duracionTipo);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar tipo de membresía
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioTipoMembresia.eliminar(id);
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