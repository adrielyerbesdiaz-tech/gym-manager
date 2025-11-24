import { cliente } from '../entities/cliente';
import { ServicioMembresia } from './ServicioMembresia';

export interface IGestorCliente {
    guardar(cliente: cliente): void;
    actualizar(cliente: cliente): void;
    eliminar(id: number): void;
    obtenerPorId(id: number): cliente | null;
    obtenerTodos(): cliente[];
}

export class ServicioCliente {
    private readonly gestorCliente: IGestorCliente;
    private readonly servicioMembresia: ServicioMembresia;

    constructor(gestorCliente: IGestorCliente, servicioMembresia: ServicioMembresia) {
        this.gestorCliente = gestorCliente;
        this.servicioMembresia = servicioMembresia;
    }

    public crearCliente(nombreCompleto: string, telefono: string, notas: string = ''): void {
        if (!nombreCompleto) {
            throw new Error('El nombre del cliente es obligatorio.');
        }

        const nuevoCliente = new cliente(nombreCompleto, telefono, notas);
        this.gestorCliente.guardar(nuevoCliente);
    }

    public actualizarCliente(clienteId: number, nombreCompleto: string, telefono: string, notas: string): void {
        const clienteExistente = this.gestorCliente.obtenerPorId(clienteId);
        
        if (!clienteExistente) {
            throw new Error('No se puede actualizar: El cliente no existe.');
        }

        const clienteActualizado = new cliente(nombreCompleto, telefono, notas, clienteId);
        
        this.gestorCliente.actualizar(clienteActualizado);
    }

    public eliminarCliente(clienteId: number): void {
        const clienteExistente = this.gestorCliente.obtenerPorId(clienteId);
        if (!clienteExistente) {
            throw new Error('No se puede eliminar: El cliente no existe.');
        }

        const estadoMembresia = this.servicioMembresia.obtenerEstadoMembresia(clienteId);
        if (estadoMembresia === 'Activa') {
            throw new Error('No se puede eliminar al cliente: Tiene una membresía activa.');
        }

        this.gestorCliente.eliminar(clienteId);
    }

    public obtenerTodosClientes(): cliente[] {
        return this.gestorCliente.obtenerTodos();
    }

    public generarReporteClientes(): any[] {
        const clientes = this.gestorCliente.obtenerTodos();
        
        return clientes.map(cliente => {
            const estado = this.servicioMembresia.obtenerEstadoMembresia(cliente.getClienteId());
            return {
                id: cliente.getClienteId(),
                nombre: cliente.getNombreCompleto(),
                telefono: cliente.getTelefono(),
                estadoMembresia: estado
            };
        });
    }
}