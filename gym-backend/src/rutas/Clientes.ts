import { Router } from 'express';
import { ServicioCliente } from '../servicios/ServicioCliente';

export function crearRouterClientes(servicioCliente: ServicioCliente): Router {
    const router = Router();

    // Crear nuevo cliente
    router.post('/', (req, res) => {
        try {
            const id = servicioCliente.crear(
                req.body.nombre,
                req.body.telefono,
                req.body.notas
            );
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todos los clientes
    router.get('/', (req, res) => {
        try {
            const clientes = servicioCliente.obtenerTodos();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Buscar clientes (por ID, nombre o teléfono)
    router.get('/buscar/:criterio', (req, res) => {
        try {
            const criterio = isNaN(Number(req.params.criterio)) 
                ? req.params.criterio 
                : Number(req.params.criterio);
            
            const resultados = servicioCliente.buscar(criterio);
            res.json(resultados);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Buscar cliente por teléfono exacto
    router.get('/telefono/:telefono', (req, res) => {
        try {
            const telefono = req.params.telefono;
            
            const todosClientes = servicioCliente.obtenerTodos();
            const cliente = todosClientes.find(c => 
                c.getTelefono() && c.getTelefono().toString() === telefono
            );
            
            if (!cliente) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Cliente no encontrado' 
                });
                return;
            }
            
            res.json(cliente);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener cliente por ID específico
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultados = servicioCliente.buscar(id);
            
            if (resultados.length === 0) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Cliente no encontrado' 
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

    // Actualizar notas del cliente
    router.patch('/:id/notas', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioCliente.actualizarNotas(id, req.body.notas);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar teléfono del cliente
    router.patch('/:id/telefono', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioCliente.actualizarTelefono(id, req.body.telefono);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar cliente
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioCliente.eliminar(id);
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