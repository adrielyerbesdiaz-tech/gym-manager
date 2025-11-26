import { asistencia } from '../entidades/Asistenciaa';
import { GestorAsistencia } from '../gestores/GestorAsistencia';
import { GestorCliente } from '../gestores/GestorCliente';

export class ServicioAsistencia {
    private readonly gestorAsistencia: GestorAsistencia;
    private readonly gestorCliente: GestorCliente;

    constructor(gestorAsistencia: GestorAsistencia, gestorCliente: GestorCliente) {
        this.gestorAsistencia = gestorAsistencia;
        this.gestorCliente = gestorCliente;
    }

    // Registrar asistencia de un cliente
    public registrarAsistencia(clienteId: number): number {
        // Verificar que el cliente existe
        const cliente = this.gestorCliente.buscarPorId(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado.');
        }

        // Verificar si ya registró hoy
        if (this.gestorAsistencia.yaRegistroHoy(clienteId)) {
            throw new Error('Este cliente ya registró su asistencia hoy.');
        }

        // TODO: Verificar que tenga membresía activa
        // const tieneMembresia = this.gestorMembresia.tieneActiva(clienteId);
        // if (!tieneMembresia) {
        //     throw new Error('El cliente no tiene una membresía activa.');
        // }

        // Registrar asistencia
        const nuevaAsistencia = new asistencia(clienteId);
        const id = this.gestorAsistencia.agregar(nuevaAsistencia);

        return id;
    }

    // Obtener historial de asistencias de un cliente
    public obtenerHistorialCliente(clienteId: number): any[] {
        const cliente = this.gestorCliente.buscarPorId(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado.');
        }

        return this.gestorAsistencia.buscarPorCliente(clienteId);
    }

    // Obtener asistencias del día
    public obtenerAsistenciasHoy(): any[] {
        return this.gestorAsistencia.obtenerAsistenciasHoy();
    }

    // Obtener asistencias por rango de fechas
    public obtenerAsistenciasPorFecha(fechaInicio: string, fechaFin: string): any[] {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }

        if (inicio > fin) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
        }

        return this.gestorAsistencia.obtenerPorRangoFechas(inicio, fin);
    }

    // Contar asistencias de un cliente
    public contarAsistenciasCliente(clienteId: number): number {
        const cliente = this.gestorCliente.buscarPorId(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado.');
        }

        return this.gestorAsistencia.contarPorCliente(clienteId);
    }

    // Verificar si un cliente ya registró hoy
    public yaRegistroHoy(clienteId: number): boolean {
        return this.gestorAsistencia.yaRegistroHoy(clienteId);
    }

    // Eliminar asistencia (por si hubo error)
    public eliminarAsistencia(asistenciaId: number): void {
        const eliminado = this.gestorAsistencia.eliminar(asistenciaId);
        
        if (!eliminado) {
            throw new Error('Asistencia no encontrada o no se pudo eliminar.');
        }
    }

    // Obtener estadísticas de asistencias
    public obtenerEstadisticas() {
        return this.gestorAsistencia.obtenerEstadisticas();
    }

    // Obtener reporte de asistencias con información del cliente
    public generarReporteAsistencias(limite?: number): any[] {
        const asistencias = this.gestorAsistencia.obtenerTodos();
        
        return asistencias.map(asist => {
            const cliente = this.gestorCliente.buscarPorId(asist.getClienteID());
            return {
                asistenciaId: asist.getAsistenciaId(),
                fechaCheckIn: asist.getFechaCheckIn(),
                cliente: cliente ? {
                    id: cliente.getClienteId(),
                    nombre: cliente.getNombreCompleto(),
                    telefono: cliente.getTelefono()
                } : null
            };
        });
    }
}