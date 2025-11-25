import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { GestorCliente } from './gestores/GestorCliente';
import { GestorAsistencia } from './gestores/GestorAsistencia';
import { GestorTipoMembresia } from './gestores/GestorTipoMembresia';
import { ServicioCliente } from './servicios/ServicioCliente';
import { ServicioAsistencia } from './servicios/ServicioAsistencia';
import { ServicioTipoMembresia } from './servicios/ServicioTipoMembresia';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new Database('gym.db');

// Inicializar gestores
const gestorCliente = new GestorCliente(db);
const gestorAsistencia = new GestorAsistencia(db);
const gestorTipoMembresia = new GestorTipoMembresia(db);

// Inicializar servicios
const servicioCliente = new ServicioCliente(gestorCliente);
const servicioAsistencia = new ServicioAsistencia(gestorAsistencia, gestorCliente);
const servicioTipoMembresia = new ServicioTipoMembresia(gestorTipoMembresia);


// ==================== ENDPOINTS DE CLIENTES ====================

// Crear nuevo cliente
app.post('/api/clientes', (req: Request, res: Response) => {
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
app.get('/api/clientes', (req: Request, res: Response) => {
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
app.get('/api/clientes/buscar/:criterio', (req: Request, res: Response) => {
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

// Buscar cliente por ID específico
app.get('/api/clientes/:id', (req: Request, res: Response) => {
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
app.patch('/api/clientes/:id/notas', (req: Request, res: Response) => {
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
app.patch('/api/clientes/:id/telefono', (req: Request, res: Response) => {
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
app.delete('/api/clientes/:id', (req: Request, res: Response) => {
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

// ==================== ENDPOINTS DE ASISTENCIAS ====================

// Registrar asistencia
app.post('/api/asistencias', (req: Request, res: Response) => {
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
app.get('/api/asistencias/hoy', (req: Request, res: Response) => {
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
app.get('/api/asistencias/cliente/:id', (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.id);
        const historial = servicioAsistencia.obtenerHistorialCliente(clienteId);
        res.json(historial);
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Verificar si un cliente ya registró hoy
app.get('/api/asistencias/verificar/:clienteId', (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.clienteId);
        const yaRegistro = servicioAsistencia.yaRegistroHoy(clienteId);
        res.json({ yaRegistro });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener asistencias por rango de fechas
app.get('/api/asistencias/rango', (req: Request, res: Response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        if (!fechaInicio || !fechaFin) {
            res.status(400).json({ 
                success: false, 
                error: 'fechaInicio y fechaFin son requeridos' 
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

// Obtener estadísticas
app.get('/api/asistencias/estadisticas', (req: Request, res: Response) => {
    try {
        const stats = servicioAsistencia.obtenerEstadisticas();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Contar asistencias de un cliente
app.get('/api/asistencias/contar/:clienteId', (req: Request, res: Response) => {
    try {
        const clienteId = Number(req.params.clienteId);
        const count = servicioAsistencia.contarAsistenciasCliente(clienteId);
        res.json({ count });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Eliminar asistencia
app.delete('/api/asistencias/:id', (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        servicioAsistencia.eliminarAsistencia(id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// ==================== ENDPOINTS DE TIPOS DE MEMBRESÍA ====================

// ==================== ENDPOINTS DE TIPOS DE MEMBRESÍA ====================

// Crear nuevo tipo de membresía
app.post('/api/tipos-membresia', (req: Request, res: Response) => {
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
app.get('/api/tipos-membresia', (req: Request, res: Response) => {
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
app.get('/api/tipos-membresia/buscar/:criterio', (req: Request, res: Response) => {
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
app.get('/api/tipos-membresia/:id', (req: Request, res: Response) => {
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
app.get('/api/tipos-membresia/ordenar/precio', (req: Request, res: Response) => {
    try {
        const ascendente = req.query.ascendente !== 'false'; // Por defecto true
        const tipos = servicioTipoMembresia.obtenerPorPrecio(ascendente);
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener tipos de membresía por tipo de duración (dias, semanas, meses)
app.get('/api/tipos-membresia/duracion/:tipo', (req: Request, res: Response) => {
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
app.post('/api/tipos-membresia/:id/calcular-vencimiento', (req: Request, res: Response) => {
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
app.put('/api/tipos-membresia/:id', (req: Request, res: Response) => {
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
app.patch('/api/tipos-membresia/:id/precio', (req: Request, res: Response) => {
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
app.patch('/api/tipos-membresia/:id/nombre', (req: Request, res: Response) => {
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
app.patch('/api/tipos-membresia/:id/duracion', (req: Request, res: Response) => {
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
app.delete('/api/tipos-membresia/:id', (req: Request, res: Response) => {
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


// Test route
app.get('/api/test', (req: Request, res: Response) => {
  const result = db.prepare('SELECT * FROM Clientes').get();
  res.json(result);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});