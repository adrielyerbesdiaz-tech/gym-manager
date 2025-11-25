import { useState, type Dispatch, type SetStateAction } from 'react';
import { UserPlus, Edit2, Trash2, X, Check, Search, Phone, FileText, Calendar, User, Filter, CreditCard, RefreshCw, Clock } from 'lucide-react';
import type { ICliente } from '../../models/ICliente';
import type { IAsistencia } from '../../models/IAsistencia';
import type { IMembresia } from '../../models/IMembresia';
import type { ITipoMembresia } from '../../models/ITipoMembresia';

interface ClientesPaginaProps {
    clientes: ICliente[];
    setClientes: Dispatch<SetStateAction<ICliente[]>>;
    asistencias: IAsistencia[];
    membresias: IMembresia[];
    setMembresias: Dispatch<SetStateAction<IMembresia[]>>;
    tiposMembresia: ITipoMembresia[];
}

interface HistorialAsistenciasProps {
    clienteId: number;
    asistencias: IAsistencia[];
}

const HistorialAsistencias: React.FC<HistorialAsistenciasProps> = ({ clienteId, asistencias }) => {
    // Filtrar por clienteId (de IAsistencia.ts)
    const asistenciasCliente = asistencias
        .filter(a => a.clienteId === clienteId)
        .sort((a, b) => new Date(b.fechaCheckIn).getTime() - new Date(a.fechaCheckIn).getTime()); // Usa fechaCheckIn

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Historial de Asistencias</h3>
            {asistenciasCliente.length === 0 ? (
                <p className="text-gray-500 bg-gray-50 p-3 rounded-md border">No hay asistencias registradas para este cliente.</p>
            ) : (
                <ul className="divide-y divide-gray-200 border rounded-lg max-h-96 overflow-y-auto">
                    {asistenciasCliente.map((asistencia, index) => (
                        <li key={asistencia.asistenciaId || index} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                            <span className="text-gray-900 font-medium">
                                {new Date(asistencia.fechaCheckIn).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-600">
                                {new Date(asistencia.fechaCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// ==================== 2. COMPONENTE AUXILIAR: HISTORIAL DE MEMBRESÍAS ====================

interface HistorialMembresiasProps {
    clienteId: number;
    membresias: IMembresia[];
    tiposMembresia: ITipoMembresia[];
}

const HistorialMembresias: React.FC<HistorialMembresiasProps> = ({ clienteId, membresias, tiposMembresia }) => {
    // Filtrar por clienteId (de IMembresia.ts)
    const membresiasCliente = membresias
        .filter(m => m.clienteId === clienteId)
        .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Membresías Registradas</h3>
            {membresiasCliente.length === 0 ? (
                <p className="text-gray-500 bg-gray-50 p-3 rounded-md border">Este cliente no tiene membresías registradas.</p>
            ) : (
                <div className="space-y-3">
                    {membresiasCliente.map(membresia => {
                        // Buscar el tipo de membresía usando tipoMembresiaId (de IMembresia.ts)
                        const tipo = tiposMembresia.find(t => t.tipoMembresiaId === membresia.tipoMembresiaId);
                        
                        // Cálculo de fecha de fin usando duracionValor y duracionTipo (de ITipoMembresia.ts)
                        const fechaFin = new Date(membresia.fechaInicio);
                        let estado = "Activa";
                        
                        if (tipo) {
                            const { duracionValor, duracionTipo } = tipo;
                            if (duracionTipo === 'dias') {
                                fechaFin.setDate(fechaFin.getDate() + duracionValor);
                            } else if (duracionTipo === 'meses') {
                                fechaFin.setMonth(fechaFin.getMonth() + duracionValor);
                            } else if (duracionTipo === 'anios') {
                                fechaFin.setFullYear(fechaFin.getFullYear() + duracionValor);
                            }
                            
                            if (fechaFin.getTime() < new Date().getTime()) {
                                estado = "Vencida";
                            }
                        }

                        return (
                            <div key={membresia.membresiaId} className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-start">
                                <div>
                                    <p className="text-lg font-bold text-blue-600">{tipo ? tipo.nombre : 'Tipo Desconocido'}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-semibold">ID Membresía:</span> {membresia.membresiaId}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Inicio:</span> {new Date(membresia.fechaInicio).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Vencimiento:</span> {fechaFin.toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${estado === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {estado}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default function ClientesPagina({ clientes, setClientes, asistencias, membresias, setMembresias, tiposMembresia }: ClientesPaginaProps) {
    const [tabActual, setTabActual] = useState<'clientes' | 'historial' | 'membresias'>('clientes');
    const [loading, setLoading] = useState(false);

    const [selectedCliente, setSelectedCliente] = useState<ICliente | null>(null); 


    // Estados para Clientes
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ICliente | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<Omit<ICliente, 'id' | 'fechaRegistro'>>({
        nombreCompleto: '',
        telefono: '',
        idTipoMembresia: 1,
        notas: ''
    });

    // Estados para Historial
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'Activa' | 'Vencida'>('todos');

    // Estados para Membresias
    const [renovarModalOpen, setRenovarModalOpen] = useState(false);
    const [membresiaARenovar, setMembresiaARenovar] = useState<IMembresia | null>(null);
    const [tipoMembresiaSeleccionada, setTipoMembresiaSeleccionada] = useState<number>(1);

// FUNCIÓN PARA ABRIR EL MODAL DE DETALLE/EDICIÓN
    const handleViewClientDetail = (cliente: ICliente) => {
        setSelectedCliente(cliente);
        setEditingClient(cliente); 
        // setModalOpen(true); // Descomenta si usas un modal para la vista de detalle
        setTabActual('clientes'); 
    };
    
    // Función para cerrar el modal de detalle
    const handleCloseModal = () => {
        setSelectedCliente(null);
        setEditingClient(null);
        // setModalOpen(false); // Descomenta si usas un modal para la vista de detalle
        setRenovarModalOpen(false);
    };
    

    // ==================== CLIENTES ====================
    const clientesFiltrados = clientes.filter(cliente =>
        cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono.includes(searchTerm)
    );

    const handleNuevoCliente = () => {
        setEditingClient(null);
        setFormData({ nombreCompleto: '', telefono: '', idTipoMembresia: 1, notas: '' });
        setModalOpen(true);
    };

    const handleEditarCliente = (cliente: ICliente) => {
        setEditingClient(cliente);
        setFormData({
            nombreCompleto: cliente.nombreCompleto,
            telefono: cliente.telefono,
            idTipoMembresia: cliente.idTipoMembresia,
            notas: cliente.notas
        });
        setModalOpen(true);
    };

    const handleGuardarCliente = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingClient) {
            setClientes(clientes.map(c =>
                c.id === editingClient.id
                    ? { ...formData, id: editingClient.id, fechaRegistro: editingClient.fechaRegistro }
                    : c
            ));
        } else {
            const nuevoCliente: ICliente = {
                ...formData,
                id: Date.now(),
                fechaRegistro: new Date().toISOString().split('T')[0]
            };
            setClientes([...clientes, nuevoCliente]);
        }
        setModalOpen(false);
    };

    const handleEliminarCliente = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            setClientes(clientes.filter(c => c.id !== id));
        }
    };

    // ==================== HISTORIAL ====================
    const asistenciasConDetalles = asistencias.map(asistencia => {
        const membresia = membresias.find(m => m.membresiaId === asistencia.membresiaId);
        const cliente = membresia ? clientes.find(c => c.id === membresia.clienteId) : null;
        const tipoMembresia = membresia ? tiposMembresia.find(t => t.tipoMembresiaId === membresia.tipoMembresiaId) : null;

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
        const cumpleEstado = estadoFiltro === 'todos' || a.membresia?.estado === estadoFiltro;

        return cumpleFechaInicio && cumpleFechaFin && cumpleNombre && cumpleEstado;
    });

    // ==================== MEMBRESIAS ====================
    const membresiasConDetalles = membresias.map(membresia => {
        const cliente = clientes.find(c => c.id === membresia.clienteId);
        const tipoMembresia = tiposMembresia.find(t => t.tipoMembresiaId === membresia.tipoMembresiaId);

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

    const handleRenovar = (membresia: IMembresia) => {
        setMembresiaARenovar(membresia);
        setTipoMembresiaSeleccionada(membresia.tipoMembresiaId);
        setRenovarModalOpen(true);
    };

    const handleGuardarRenovacion = (e: React.FormEvent) => {
        e.preventDefault();

        if (!membresiaARenovar) return;

        const nuevaMembresia: IMembresia = {
            membresiaId: Date.now(),
            tipoMembresiaId: tipoMembresiaSeleccionada,
            clienteId: membresiaARenovar.clienteId,
            fechaInicio: new Date().toISOString().split('T')[0],
            tipoMembresia: tiposMembresia.find(t => t.tipoMembresiaId === tipoMembresiaSeleccionada),
            cliente: membresiaARenovar.cliente,
            estado: 'Activa'
        };

        setMembresias([nuevaMembresia, ...membresias]);
        setRenovarModalOpen(false);
        setMembresiaARenovar(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Título y Controles */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Clientes</h1>
            <div className="flex justify-between items-center mb-6">
                 {/* ... Controles de búsqueda y filtros ... */}
                <button 
                    onClick={() => setModalOpen(true)} // Abrir modal de creación
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
                >
                    <UserPlus className="w-5 h-5" />
                    Crear Nuevo Cliente
                </button>
            </div>
            
            {/* Tabla de Clientes */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clientes.map((cliente) => (
                            <tr key={cliente.id} className="hover:bg-gray-50 cursor-pointer">
                                {/* Usando atributos de ICliente.ts: nombreCompleto, telefono, fechaRegistro */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.nombreCompleto}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefono}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(cliente.fechaRegistro).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleViewClientDetail(cliente); }}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        title="Ver Detalles"
                                    >
                                        <FileText className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Detalle/Historia/Membresías */}
            {selectedCliente && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedCliente.nombreCompleto}</h2>
                        
                        {/* Botones de Pestaña */}
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setTabActual('clientes')}
                                className={`py-2 px-4 text-sm font-medium ${tabActual === 'clientes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Cliente
                            </button>
                            <button
                                onClick={() => setTabActual('historial')}
                                className={`py-2 px-4 text-sm font-medium ${tabActual === 'historial' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Historia <Clock className="w-4 h-4 inline ml-1" />
                            </button>
                            <button
                                onClick={() => setTabActual('membresias')}
                                className={`py-2 px-4 text-sm font-medium ${tabActual === 'membresias' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Membresías <CreditCard className="w-4 h-4 inline ml-1" />
                            </button>
                        </div>

                        <div className="mt-4 max-h-[60vh] overflow-y-auto p-2">
                            {/* PESTAÑA CLIENTES (Información básica/Edición) */}
                            {tabActual === 'clientes' && (
                                <div className='space-y-4'>
                                    {/* Usando atributos de ICliente.ts: id, telefono, fechaRegistro, notas */}
                                    <p><span className='font-semibold'>ID:</span> {selectedCliente.id}</p>
                                    <p><span className='font-semibold'>Teléfono:</span> {selectedCliente.telefono}</p>
                                    <p><span className='font-semibold'>Registro:</span> {new Date(selectedCliente.fechaRegistro).toLocaleDateString()}</p>
                                    <p><span className='font-semibold'>Notas:</span> {selectedCliente.notas || 'Sin notas'}</p>
                                    <button 
                                        onClick={() => { setRenovarModalOpen(true); setTipoMembresiaSeleccionada(null); }}
                                        className='mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600'
                                    >
                                        Renovar Membresía
                                    </button>
                                </div>
                            )}

                            {/* PESTAÑA HISTORIAL (Asistencias) */}
                            {tabActual === 'historial' && (
                                <HistorialAsistencias
                                    clienteId={selectedCliente.id}
                                    asistencias={asistencias}
                                />
                            )}

                            {/* PESTAÑA MEMBRESÍAS */}
                            {tabActual === 'membresias' && (
                                <HistorialMembresias
                                    clienteId={selectedCliente.id}
                                    membresias={membresias}
                                    tiposMembresia={tiposMembresia}
                                />
                            )}
                        </div>

                        {/* Botón de cerrar modal */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Renovar Membresía */}
            {renovarModalOpen && selectedCliente && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-xl font-bold mb-4">Renovar Membresía para {selectedCliente.nombreCompleto}</h3>
                        
                        {/* El resto del JSX del modal de renovación... */}
                        <p className="text-sm text-gray-500">Selecciona el nuevo tipo de membresía y el formulario de pago.</p>
                        
                        <div className="mt-4">
                            <label htmlFor="tipoMembresia" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Membresía</label>
                            <select
                                id="tipoMembresia"
                                value={tipoMembresiaSeleccionada || ''}
                                onChange={(e) => setTipoMembresiaSeleccionada(Number(e.target.value))}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Selecciona un tipo</option>
                                {tiposMembresia.map(tipo => (
                                    <option key={tipo.tipoMembresiaId} value={tipo.tipoMembresiaId}>
                                        {tipo.nombre} (${tipo.precio})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ... otros campos del formulario ... */}

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setRenovarModalOpen(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || tipoMembresiaSeleccionada === null}
                                className="flex-1 bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : (
                                    <>
                                        <RefreshCw className="w-5 h-5" />
                                        Renovar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal de Crear Cliente (Si usas modalOpen) */}
            {/* {modalOpen && (
                ...
            )} */}
        </div>
    );
}