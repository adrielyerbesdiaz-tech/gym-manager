import { Router } from 'express';
import { crearRouterClientes } from './Clientes';
import { crearRouterAsistencias } from './Asistencias';
import { crearRouterTiposMembresia } from './TiposMembresia';
import { crearRouterEquipamiento } from './Equipamiento';
import { crearRouterMantenimiento } from './Mantenimiento';
import { crearRouterMembresias } from './Membresias';
import { crearRouterUsuarios } from './Usuarios';
import { crearRouterAccesorios } from './Accesorios';
import { crearRouterPagos } from './Pagos';

// Importar servicios (se pasarán como dependencias)
import { ServicioCliente } from '../servicios/ServicioCliente';
import { ServicioAsistencia } from '../servicios/ServicioAsistencia';
import { ServicioTipoMembresia } from '../servicios/ServicioTipoMembresia';
import { ServicioEquipamiento } from '../servicios/ServicioEquipamiento';
import { ServicioMantenimiento } from '../servicios/ServicioMantenimiento';
import { ServicioMembresia } from '../servicios/ServicioMembresia';
import { ServicioUsuario } from '../servicios/ServicioUsuario';
import { ServicioEquipamientoAccesorio } from '../servicios/ServicioEquipamientoAccesorio';
import { ServicioPago } from '../servicios/ServicioPago';

export interface DependenciasServicios {
    servicioCliente: ServicioCliente;
    servicioAsistencia: ServicioAsistencia;
    servicioTipoMembresia: ServicioTipoMembresia;
    servicioEquipamiento: ServicioEquipamiento;
    servicioMantenimiento: ServicioMantenimiento;
    servicioMembresia: ServicioMembresia;
    servicioUsuario: ServicioUsuario;
    servicioEquipamientoAccesorio: ServicioEquipamientoAccesorio;
    servicioPago: ServicioPago;
}

export function configurarRutas(dependencias: DependenciasServicios): Router {
    const router = Router();

    // Configurar todas las rutas
    router.use('/clientes', crearRouterClientes(dependencias.servicioCliente));
    router.use('/asistencias', crearRouterAsistencias(dependencias.servicioAsistencia));
    router.use('/tipos-membresia', crearRouterTiposMembresia(dependencias.servicioTipoMembresia));
    router.use('/equipamiento', crearRouterEquipamiento(dependencias.servicioEquipamiento));
    router.use('/mantenimiento', crearRouterMantenimiento(dependencias.servicioMantenimiento));
    router.use('/membresias', crearRouterMembresias(dependencias.servicioMembresia));
    router.use('/usuarios', crearRouterUsuarios(dependencias.servicioUsuario));
    router.use('/accesorios', crearRouterAccesorios(dependencias.servicioEquipamientoAccesorio));
    router.use('/pagos', crearRouterPagos(dependencias.servicioPago));

    return router;
}