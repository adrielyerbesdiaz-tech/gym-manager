import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

import { GestorCliente } from './gestores/GestorCliente';
import { GestorAsistencia } from './gestores/GestorAsistencia';
import { GestorEquipamiento } from './gestores/GestorEquipamiento';
import { GestorTipoMembresia } from './gestores/GestorTipoMembresia';
import { GestorMantenimiento } from './gestores/GestorMantenimiento';
import { GestorMembresia } from './gestores/GestorMembresia';
import { GestorUsuario } from './gestores/GestorUsuario';
import { GestorEquipamientoAccesorio } from './gestores/GestorEquipamientoAccesorio';
import { GestorPago } from './gestores/GestorPago';

import { ServicioCliente } from './servicios/ServicioCliente';
import { ServicioAsistencia } from './servicios/ServicioAsistencia';
import { ServicioTipoMembresia } from './servicios/ServicioTipoMembresia';
import { ServicioEquipamiento } from './servicios/ServicioEquipamiento';
import { ServicioMantenimiento } from './servicios/ServicioMantenimiento';
import { ServicioMembresia } from './servicios/ServicioMembresia';
import { ServicioUsuario } from './servicios/ServicioUsuario';
import { ServicioEquipamientoAccesorio } from './servicios/ServicioEquipamientoAccesorio';
import { ServicioPago } from './servicios/ServicioPago';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new Database('gym.db');

// Inicializar gestores
const gestorCliente = new GestorCliente(db);
const gestorEquipamiento = new GestorEquipamiento(db);
const gestorAsistencia = new GestorAsistencia(db);
const gestorTipoMembresia = new GestorTipoMembresia(db);
const gestorMantenimiento = new GestorMantenimiento(db);
const gestorMembresia = new GestorMembresia(db);
const gestorUsuario = new GestorUsuario(db);
const gestorEquipamientoAccesorio = new GestorEquipamientoAccesorio(db);
const gestorPago = new GestorPago(db);

// Inicializar servicios
const servicioCliente = new ServicioCliente(gestorCliente);
const servicioEquipamiento = new ServicioEquipamiento(gestorEquipamiento);
const servicioAsistencia = new ServicioAsistencia(gestorAsistencia, gestorCliente);
const servicioMantenimiento = new ServicioMantenimiento(gestorMantenimiento);
const servicioTipoMembresia = new ServicioTipoMembresia(gestorTipoMembresia);
const servicioMembresia = new ServicioMembresia(gestorMembresia, gestorTipoMembresia);
const servicioUsuario = new ServicioUsuario(gestorUsuario);
const servicioEquipamientoAccesorio = new ServicioEquipamientoAccesorio(gestorEquipamientoAccesorio);
const servicioPago = new ServicioPago(gestorPago);


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

// Buscar cliente por teléfono exacto
app.get('/api/clientes/telefono/:telefono', (req: Request, res: Response) => {
    try {
        const telefono = req.params.telefono;
        
        // Obtener todos los clientes y filtrar
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

// ==================== ENDPOINTS DE EQUIPAMIENTO ====================

// Crear nuevo equipamiento
app.post('/api/equipamiento', (req: Request, res: Response) => {
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
app.get('/api/equipamiento', (req: Request, res: Response) => {
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
app.get('/api/equipamiento/buscar/:criterio', (req: Request, res: Response) => {
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
app.get('/api/equipamiento/:id', (req: Request, res: Response) => {
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
app.put('/api/equipamiento/:id', (req: Request, res: Response) => {
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
app.delete('/api/equipamiento/:id', (req: Request, res: Response) => {
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

// ==================== ENDPOINTS DE MANTENIMIENTO ====================

// Registrar nuevo mantenimiento
app.post('/api/mantenimiento', (req: Request, res: Response) => {
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
app.get('/api/mantenimiento', (req: Request, res: Response) => {
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
app.get('/api/mantenimiento/buscar/:criterio', (req: Request, res: Response) => {
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
app.get('/api/mantenimiento/:id', (req: Request, res: Response) => {
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
app.delete('/api/mantenimiento/:id', (req: Request, res: Response) => {
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

// ==================== ENDPOINTS DE MEMBRESÍAS ====================

// Crear nueva membresía (asignar membresía a usuario)
app.post('/api/membresias', (req: Request, res: Response) => {
    try {
        const { tipoMembresiaID, usuarioID } = req.body;
        
        // Validación básica de entrada
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
app.get('/api/membresias', (req: Request, res: Response) => {
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
app.get('/api/membresias/:id', (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const resultado = servicioMembresia.buscarPorId(id);
        res.json(resultado);
    } catch (error) {
        // Si es error de "no encontrada" podría ser 404, pero aquí simplificamos
        const status = error instanceof Error && error.message.includes('no encontrada') ? 404 : 500;
        res.status(status).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener historial de membresías de un usuario específico
app.get('/api/membresias/usuario/:usuarioId', (req: Request, res: Response) => {
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

// Eliminar membresía
app.delete('/api/membresias/:id', (req: Request, res: Response) => {
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

// Obtener membresías activas de un usuario
app.get('/api/membresias/usuario/:usuarioId/activas', (req: Request, res: Response) => {
    try {
        const usuarioId = Number(req.params.usuarioId);
        const membresiasActivas = servicioMembresia.obtenerMembresiasActivas(usuarioId);
        res.json(membresiasActivas);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener todas las membresías activas
app.get('/api/membresias/activas', (req: Request, res: Response) => {
    try {
        const membresiasActivas = servicioMembresia.obtenerMembresiasActivas();
        res.json(membresiasActivas);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener membresías próximas a vencer
app.get('/api/membresias/proximas-vencer', (req: Request, res: Response) => {
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
app.get('/api/membresias/vencidas', (req: Request, res: Response) => {
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
app.get('/api/membresias/usuario/:usuarioId/tiene-activa', (req: Request, res: Response) => {
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
app.post('/api/membresias/:id/renovar', (req: Request, res: Response) => {
    try {
        const membresiaId = Number(req.params.id);
        const { nuevoTipoMembresiaID } = req.body; // Opcional
        
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
app.get('/api/membresias/:id/estado', (req: Request, res: Response) => {
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

// ==================== ENDPOINTS DE USUARIOS ====================

// Crear nuevo usuario
app.post('/api/usuarios', (req: Request, res: Response) => {
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
app.get('/api/usuarios', (req: Request, res: Response) => {
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
app.get('/api/usuarios/:id', (req: Request, res: Response) => {
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
app.get('/api/usuarios/buscar/nombre/:nombreUsuario', (req: Request, res: Response) => {
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
app.patch('/api/usuarios/:id/nombre', (req: Request, res: Response) => {
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
app.patch('/api/usuarios/:id/contrasena', (req: Request, res: Response) => {
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
app.delete('/api/usuarios/:id', (req: Request, res: Response) => {
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

// ==================== ENDPOINTS DE ACCESORIOS DE EQUIPAMIENTO ====================

// Crear nuevo accesorio
app.post('/api/accesorios', (req: Request, res: Response) => {
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
app.get('/api/accesorios', (req: Request, res: Response) => {
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
app.get('/api/accesorios/:id', (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const resultado = servicioEquipamientoAccesorio.buscarPorId(id);
        res.json(resultado);
    } catch (error) {
        // 404 si no se encuentra, 500 para otros errores
        const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
        res.status(status).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener accesorios por ID de Equipo (FK)
app.get('/api/accesorios/equipo/:equipoId', (req: Request, res: Response) => {
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
app.patch('/api/accesorios/:id/notas', (req: Request, res: Response) => {
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
app.delete('/api/accesorios/:id', (req: Request, res: Response) => {
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

// ==================== ENDPOINTS DE PAGOS ====================

// Registrar nuevo pago
app.post('/api/pagos', (req: Request, res: Response) => {
    try {
        const { membresiaID, monto } = req.body;
        
        if (!membresiaID || monto === undefined || monto === null) {
            res.status(400).json({ 
                success: false, 
                error: 'membresiaID y monto son requeridos' 
            });
            return;
        }

        const id = servicioPago.crear(Number(membresiaID), Number(monto));
        res.json({ success: true, id });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener todos los pagos
app.get('/api/pagos', (req: Request, res: Response) => {
    try {
        const pagos = servicioPago.obtenerTodos();
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener pago por ID
app.get('/api/pagos/:id', (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const resultado = servicioPago.buscarPorId(id);
        res.json(resultado);
    } catch (error) {
        // 404 si no se encuentra, 500 para otros errores
        const status = error instanceof Error && error.message.includes('no encontrado') ? 404 : 500;
        res.status(status).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Obtener historial de pagos para una membresía específica
app.get('/api/pagos/membresia/:membresiaId', (req: Request, res: Response) => {
    try {
        const membresiaId = Number(req.params.membresiaId);
        const resultados = servicioPago.buscarPorMembresia(membresiaId);
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        });
    }
});

// Eliminar pago
app.delete('/api/pagos/:id', (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        servicioPago.eliminar(id);
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