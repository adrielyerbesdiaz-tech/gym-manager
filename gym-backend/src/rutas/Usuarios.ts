import { Router } from 'express';
import { ServicioUsuario } from '../servicios/ServicioUsuario';

export function crearRouterUsuarios(servicioUsuario: ServicioUsuario): Router {
    const router = Router();

    // Crear nuevo usuario
    router.post('/', (req, res) => {
        try {
            const { nombreUsuario, contrasenaHash } = req.body;
            
            if (!nombreUsuario || !contrasenaHash) {
                res.status(400).json({ 
                    success: false, 
                    error: 'nombreUsuario y contrasenaHash son requeridos' 
                });
                return;
            }

            const id = servicioUsuario.crear(nombreUsuario, contrasenaHash);
            res.json({ success: true, id });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener todos los usuarios
    router.get('/', (req, res) => {
        try {
            const usuarios = servicioUsuario.obtenerTodos();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Obtener usuario por ID específico
    router.get('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            const resultado = servicioUsuario.buscarPorId(id);
            res.json(resultado);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Buscar usuario por nombre de usuario
    router.get('/buscar/nombre/:nombreUsuario', (req, res) => {
        try {
            const nombreUsuario = req.params.nombreUsuario;
            const resultado = servicioUsuario.buscarPorNombreUsuario(nombreUsuario);
            res.json(resultado);
        } catch (error) {
            const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
            res.status(status).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar nombre de usuario
    router.patch('/:id/nombre', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { nombreUsuario } = req.body;
            
            if (!nombreUsuario) {
                res.status(400).json({ 
                    success: false, 
                    error: 'nombreUsuario es requerido' 
                });
                return;
            }

            servicioUsuario.actualizarNombre(id, nombreUsuario);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Actualizar contraseña (hash)
    router.patch('/:id/contrasena', (req, res) => {
        try {
            const id = Number(req.params.id);
            const { contrasenaHash } = req.body;
            
            if (!contrasenaHash) {
                res.status(400).json({ 
                    success: false, 
                    error: 'contrasenaHash es requerido' 
                });
                return;
            }

            servicioUsuario.actualizarContrasena(id, contrasenaHash);
            res.json({ success: true });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    });

    // Eliminar usuario
    router.delete('/:id', (req, res) => {
        try {
            const id = Number(req.params.id);
            servicioUsuario.eliminar(id);
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