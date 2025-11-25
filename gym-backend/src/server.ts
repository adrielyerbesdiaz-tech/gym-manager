import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { GestorCliente } from './gestores/GestorCliente';
import { ServicioCliente } from './servicios/ServicioCliente';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new Database('gym.db');

// Inicializar gestor y servicio
const gestorCliente = new GestorCliente(db);
const servicioCliente = new ServicioCliente(gestorCliente);

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




// Test route
app.get('/api/test', (req: Request, res: Response) => {
  const result = db.prepare('SELECT * FROM Clientes').get();
  res.json(result);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});