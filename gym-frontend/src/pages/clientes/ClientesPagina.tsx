import { useState, type Dispatch, type SetStateAction } from 'react';
import { UserPlus, Edit2, Trash2, X, Check, Search, Phone, FileText, Calendar, User, Filter, CreditCard, RefreshCw, Clock } from 'lucide-react';

// Interfaces basadas DIRECTAMENTE en las clases del Backend
interface Cliente {
    Id: number;
    nombreCompleto: string;
    telefono: number;
    notas: string;
    fechaRegistro: Date | string;
}

interface Asistencia {
    asistenciaId: number;
    clienteID: number;
    fechaCheckIn: Date | string;
}

// Extendemos para el frontend para poder guardar objetos completos si es necesario en la vista
interface Membresia {
    membresiaId: number;
    tipoMembresiaID: number;
    usuarioID: number; // En backend se llama usuarioID (aunque sea el cliente)
    fechaInicio: Date | string;
    // Propiedades auxiliares para la vista (joins simulados)
    tipoMembresia?: TipoMembresia;
    cliente?: Cliente;
    estado?: 'Activa' | 'Vencida';
}

interface TipoMembresia {
    tipoMembresiaID: number;
    nombre: string;
    duracionDias: number;
    precio: number;
}

interface Pago {
    pagoId: number;
    membresiaID: number;
    monto: number;
    fechaPago: Date | string;
}

interface ClientesPaginaProps {
    clientes: Cliente[];
    setClientes: Dispatch<SetStateAction<Cliente[]>>;
    asistencias: Asistencia[];
    membresias: Membresia[];
    setMembresias: Dispatch<SetStateAction<Membresia[]>>;
    tiposMembresia: TipoMembresia[];
    pagos: Pago[];
    setPagos: Dispatch<SetStateAction<Pago[]>>;
}

export default function ClientesPagina({ clientes, setClientes, asistencias, membresias, setMembresias, tiposMembresia, pagos, setPagos }: ClientesPaginaProps) {
    const [tabActual, setTabActual] = useState<'clientes' | 'historial' | 'membresias'>('clientes');

    // Estados para Clientes
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Cliente | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Ajustado a las variables del backend (ej. tipoMembresiaID)
    const [formData, setFormData] = useState<{
        nombreCompleto: string;
        telefono: string;
        tipoMembresiaID: number;
        notas: string;
    }>({
        nombreCompleto: '',
        telefono: '',
        tipoMembresiaID: 1,
        notas: ''
    });

    // Estados para Historial
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'Activa' | 'Vencida'>('todos');

    // Estados para Membresias
    const [renovarModalOpen, setRenovarModalOpen] = useState(false);
    const [membresiaARenovar, setMembresiaARenovar] = useState<Membresia | null>(null);
    const [tipoMembresiaSeleccionada, setTipoMembresiaSeleccionada] = useState<number>(1);

    // ==================== CLIENTES ====================
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono.toString().includes(searchTerm)
    );

    const handleNuevoCliente = () => {
        setEditingClient(null);
        // Usamos tipoMembresiaID
        setFormData({ nombreCompleto: '', telefono: '', tipoMembresiaID: tiposMembresia[0]?.tipoMembresiaID || 1, notas: '' });
        setModalOpen(true);
    };

    const handleEditarCliente = (cliente: Cliente) => {
        setEditingClient(cliente);
        // Buscamos la membresía actual del cliente para rellenar el form (lógica simulada de frontend)
        const membresiaActual = membresias.find(m => m.usuarioID === cliente.Id);
        setFormData({
            nombreCompleto: cliente.nombreCompleto,
            telefono: cliente.telefono.toString(),
            tipoMembresiaID: membresiaActual ? membresiaActual.tipoMembresiaID : 1,
            notas: cliente.notas
        });
        setModalOpen(true);
    };

    const handleGuardarCliente = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingClient) {
            // Al editar, solo actualizar el cliente
            setClientes(clientes.map(c =>
                c.Id === editingClient.Id
                    ? {
                        ...c,
                        nombreCompleto: formData.nombreCompleto,
                        telefono: Number(formData.telefono),
                        notas: formData.notas
                    }
                    : c
            ));
        } else {
            // Al crear nuevo cliente, auto-crear membresía y pago
            const nuevoId = Date.now(); // Simula Id autogenerado
            const nuevaMembresiaId = nuevoId + 1;
            const nuevoPagoId = nuevoId + 2;

            const nuevoCliente: Cliente = {
                Id: nuevoId,
                nombreCompleto: formData.nombreCompleto,
                telefono: Number(formData.telefono),
                notas: formData.notas,
                fechaRegistro: new Date().toISOString().split('T')[0]
            };

            // Crear membresía automáticamente usando las variables del backend
            const tipoMembresia = tiposMembresia.find(t => t.tipoMembresiaID === formData.tipoMembresiaID);
            const nuevaMembresia: Membresia = {
                membresiaId: nuevaMembresiaId,
                tipoMembresiaID: formData.tipoMembresiaID,
                usuarioID: nuevoId, // Mapeado a usuarioID según la clase backend
                fechaInicio: new Date().toISOString().split('T')[0],
                // Props extendidas para la vista
                tipoMembresia: tipoMembresia,
                cliente: nuevoCliente,
                estado: 'Activa'
            };

            // Crear pago inicial automáticamente
            const nuevoPago: Pago = {
                pagoId: nuevoPagoId,
                membresiaID: nuevaMembresiaId,
                monto: tipoMembresia?.precio || 0,
                fechaPago: new Date().toISOString().split('T')[0]
            };

            setClientes([...clientes, nuevoCliente]);
            setMembresias([...membresias, nuevaMembresia]);
            setPagos([...pagos, nuevoPago]);
        }
        setModalOpen(false);
    };

    const handleEliminarCliente = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            setClientes(clientes.filter(c => c.Id !== id));
        }
    };

    // ==================== HISTORIAL ====================
    const asistenciasConDetalles = asistencias.map(asistencia => {
        // Buscar cliente por clienteID
        const cliente = clientes.find(c => c.Id === asistencia.clienteID);
        // Buscar membresia por usuarioID (que es el clienteID)
        const membresia = membresias.find(m => m.usuarioID === asistencia.clienteID);
        const tipoMembresia = membresia ? tiposMembresia.find(t => t.tipoMembresiaID === membresia.tipoMembresiaID) : null;

        return {
            ...asistencia,
            cliente,
            membresia,
            tipoMembresia
        };
    });

    const asistenciasFiltradas = asistenciasConDetalles.filter(a => {
        const fechaCheckIn = new Date(a.fechaCheckIn);
        const cumpleFechaInicio = !fechaInicio || fechaCheckIn >= new Date(fechaInicio);
        const cumpleFechaFin = !fechaFin || fechaCheckIn <= new Date(fechaFin + 'T23:59:59');
        const cumpleNombre = !nombreFiltro || a.cliente?.nombreCompleto.toLowerCase().includes(nombreFiltro.toLowerCase());

        // Estado se deriva de la membresía asociada al cliente
        const estadoMembresia = a.membresia?.estado || 'Vencida';
        const cumpleEstado = estadoFiltro === 'todos' || estadoMembresia === estadoFiltro;

        return cumpleFechaInicio && cumpleFechaFin && cumpleNombre && cumpleEstado;
    });

    // ==================== MEMBRESIAS ====================
    const membresiasConDetalles = membresias.map(membresia => {
        const cliente = clientes.find(c => c.Id === membresia.usuarioID); // usuarioID es el link al cliente
        const tipoMembresia = tiposMembresia.find(t => t.tipoMembresiaID === membresia.tipoMembresiaID);

        // Calcular fecha de vencimiento
        const fechaInicio = new Date(membresia.fechaInicio);
        const duracionDias = tipoMembresia?.duracionDias || 30;
        const fechaVencimiento = new Date(fechaInicio);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + duracionDias);

        // Determinar estado
        const hoy = new Date();
        const estado: 'Activa' | 'Vencida' = hoy <= fechaVencimiento ? 'Activa' : 'Vencida';

        return {
            ...membresia,
            cliente,
            tipoMembresia,
            fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
            estado
        };
    });

    const handleRenovar = (membresia: Membresia) => {
        setMembresiaARenovar(membresia);
        setTipoMembresiaSeleccionada(membresia.tipoMembresiaID);
        setRenovarModalOpen(true);
    };

    const handleGuardarRenovacion = (e: React.FormEvent) => {
        e.preventDefault();

        if (!membresiaARenovar) return;

        const nuevaMembresia: Membresia = {
            membresiaId: Date.now(),
            tipoMembresiaID: tipoMembresiaSeleccionada,
            usuarioID: membresiaARenovar.usuarioID,
            fechaInicio: new Date().toISOString().split('T')[0],
            tipoMembresia: tiposMembresia.find(t => t.tipoMembresiaID === tipoMembresiaSeleccionada),
            cliente: membresiaARenovar.cliente,
            estado: 'Activa'
        };

        setMembresias([nuevaMembresia, ...membresias]);
        setRenovarModalOpen(false);
        setMembresiaARenovar(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Clientes</h1>
                    <p className="text-gray-600">Administra clientes, historial y membresías</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setTabActual('clientes')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'clientes'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Clientes
                                </div>
                            </button>
                            <button
                                onClick={() => setTabActual('historial')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'historial'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Historial
                                </div>
                            </button>
                            <button
                                onClick={() => setTabActual('membresias')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'membresias'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Membresías
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* TAB 1: CLIENTES */}
                        {tabActual === 'clientes' && (
                            <div className="space-y-6">
                                {/* Barra de controles */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="relative w-full sm:w-96">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o teléfono..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>

                                    <button
                                        onClick={handleNuevoCliente}
                                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium py-2 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        Nuevo Cliente
                                    </button>
                                </div>

                                {/* Tabla de clientes */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" /> Nombre
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4" /> Teléfono
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4" /> Membresía
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" /> Notas
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" /> Registro
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {clientesFiltrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Search className="w-8 h-8 text-gray-300" />
                                                            <p>No se encontraron clientes</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                clientesFiltrados.map((cliente) => {
                                                    // Simulamos join buscando la membresía activa
                                                    const membresiaCliente = membresias.find(m => m.usuarioID === cliente.Id);
                                                    const tipoMembresia = membresiaCliente
                                                        ? tiposMembresia.find(t => t.tipoMembresiaID === membresiaCliente.tipoMembresiaID)
                                                        : null;

                                                    return (
                                                        <tr key={cliente.Id} className="hover:bg-gray-50 transition-colors group">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {cliente.nombreCompleto}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-600 font-mono">
                                                                    {cliente.telefono}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                    {tipoMembresia?.nombre || 'Sin membresía'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-600 max-w-xs truncate" title={cliente.notas}>
                                                                    {cliente.notas || <span className="text-gray-400 italic">Sin notas</span>}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">
                                                                    {new Date(cliente.fechaRegistro).toLocaleDateString()}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-3">
                                                                    <button
                                                                        onClick={() => handleEditarCliente(cliente)}
                                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEliminarCliente(cliente.Id)}
                                                                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="text-sm text-gray-500 text-center">
                                    Mostrando {clientesFiltrados.length} de {clientes.length} clientes
                                </div>
                            </div>
                        )}

                        {/* TAB 2: HISTORIAL */}
                        {tabActual === 'historial' && (
                            <div className="space-y-6">
                                {/* Filtros */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Filter className="w-4 h-4 text-gray-600" />
                                        <h3 className="font-medium text-gray-900">Filtros</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha Inicio
                                            </label>
                                            <input
                                                type="date"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha Fin
                                            </label>
                                            <input
                                                type="date"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre Cliente
                                            </label>
                                            <input
                                                type="text"
                                                value={nombreFiltro}
                                                onChange={(e) => setNombreFiltro(e.target.value)}
                                                placeholder="Buscar..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Estado Membresía
                                            </label>
                                            <select
                                                value={estadoFiltro}
                                                onChange={(e) => setEstadoFiltro(e.target.value as any)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="todos">Todos</option>
                                                <option value="Activa">Activa</option>
                                                <option value="Vencida">Vencida</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla de historial */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Fecha/Hora
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Tipo Membresía
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {asistenciasFiltradas.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Clock className="w-8 h-8 text-gray-300" />
                                                            <p>No se encontraron registros de asistencia</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                asistenciasFiltradas.map((asistencia) => (
                                                    <tr key={asistencia.asistenciaId} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(asistencia.fechaCheckIn).toLocaleString('es-MX', {
                                                                    dateStyle: 'short',
                                                                    timeStyle: 'short'
                                                                })}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {asistencia.cliente?.nombreCompleto || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600">
                                                                {asistencia.tipoMembresia?.nombre || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${asistencia.membresia?.estado === 'Activa'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {asistencia.membresia?.estado || 'N/A'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="text-sm text-gray-500 text-center">
                                    Mostrando {asistenciasFiltradas.length} de {asistencias.length} registros
                                </div>
                            </div>
                        )}

                        {/* TAB 3: MEMBRESIAS */}
                        {tabActual === 'membresias' && (
                            <div className="space-y-6">
                                {/* Tabla de membresías */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Cliente
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Tipo
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Inicio
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Vencimiento
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {membresiasConDetalles.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <CreditCard className="w-8 h-8 text-gray-300" />
                                                            <p>No hay membresías registradas</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                membresiasConDetalles.map((membresia) => (
                                                    <tr key={membresia.membresiaId} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {membresia.cliente?.nombreCompleto || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600">
                                                                {membresia.tipoMembresia?.nombre || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600">
                                                                {new Date(membresia.fechaInicio).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-600">
                                                                {new Date(membresia.fechaVencimiento).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${membresia.estado === 'Activa'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {membresia.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => handleRenovar(membresia)}
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 transition-colors font-medium text-sm"
                                                            >
                                                                <RefreshCw className="w-4 h-4" />
                                                                Renovar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="text-sm text-gray-500 text-center">
                                    Total de membresías: {membresias.length}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Nuevo/Editar Cliente */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </h2>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGuardarCliente} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombreCompleto}
                                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 9999026122"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Membresía
                                </label>
                                <select
                                    required
                                    value={formData.tipoMembresiaID}
                                    onChange={(e) => setFormData({ ...formData, tipoMembresiaID: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {tiposMembresia.map(tipo => (
                                        <option key={tipo.tipoMembresiaID} value={tipo.tipoMembresiaID}>
                                            {tipo.nombre} - ${tipo.precio} ({tipo.duracionDias} días)
                                        </option>
                                    ))}
                                </select>
                                {!editingClient && (
                                    <p className="mt-1 text-xs text-green-600">
                                        ✓ Se creará automáticamente la membresía y el pago inicial
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notas
                                </label>
                                <textarea
                                    value={formData.notas}
                                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                    placeholder="Información adicional..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Renovar Membresía */}
            {renovarModalOpen && membresiaARenovar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                Renovar Membresía
                            </h2>
                            <button
                                onClick={() => setRenovarModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGuardarRenovacion} className="p-6 space-y-5">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>Cliente:</strong> {clientes.find(c => c.Id === membresiaARenovar.usuarioID)?.nombreCompleto}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Membresía
                                </label>
                                <select
                                    value={tipoMembresiaSeleccionada}
                                    onChange={(e) => setTipoMembresiaSeleccionada(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {tiposMembresia.map(tipo => (
                                        <option key={tipo.tipoMembresiaID} value={tipo.tipoMembresiaID}>
                                            {tipo.nombre} - ${tipo.precio} ({tipo.duracionDias} días)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Precio:</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${tiposMembresia.find(t => t.tipoMembresiaID === tipoMembresiaSeleccionada)?.precio}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRenovarModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Renovar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}