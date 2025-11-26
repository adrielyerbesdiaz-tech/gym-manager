import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

// Importar gestores y servicios
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

// Importar configuración de rutas
import { configurarRutas, DependenciasServicios } from './rutas';

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
const servicios: DependenciasServicios = {
    servicioCliente: new ServicioCliente(gestorCliente),
    servicioEquipamiento: new ServicioEquipamiento(gestorEquipamiento),
    servicioAsistencia: new ServicioAsistencia(gestorAsistencia, gestorCliente),
    servicioMantenimiento: new ServicioMantenimiento(gestorMantenimiento),
    servicioTipoMembresia: new ServicioTipoMembresia(gestorTipoMembresia),
    servicioMembresia: new ServicioMembresia(gestorMembresia, gestorTipoMembresia),
    servicioUsuario: new ServicioUsuario(gestorUsuario),
    servicioEquipamientoAccesorio: new ServicioEquipamientoAccesorio(gestorEquipamientoAccesorio),
    servicioPago: new ServicioPago(gestorPago)
};

// Configurar todas las rutas
app.use('/api', configurarRutas(servicios));

// Test route
app.get('/api/test', (req, res) => {
    const result = db.prepare('SELECT * FROM Clientes').get();
    res.json(result);
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});