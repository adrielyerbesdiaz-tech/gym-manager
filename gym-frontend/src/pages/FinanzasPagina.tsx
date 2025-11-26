import { useState, type Dispatch, type SetStateAction } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Plus, Calendar, User, FileText, CreditCard, Wallet, BarChart3 } from 'lucide-react';
import type { IPago } from '../models/IPago';
import type { IMantenimiento } from '../models/IMantenimiento';
import type { IMembresia } from '../models/IMembresia';
import type { IEquipamiento } from '../models/IEquipamiento';
import type { ICliente } from '../models/ICliente';

interface FinanzasPaginaProps {
    pagos: IPago[];
    setPagos: Dispatch<SetStateAction<IPago[]>>;
    mantenimientos: IMantenimiento[];
    membresias: IMembresia[];
    equipamiento: IEquipamiento[];
    clientes: ICliente[];
}

export default function FinanzasPagina({
    pagos,
    setPagos,
    mantenimientos,
    membresias,
    equipamiento,
    clientes
}: FinanzasPaginaProps) {
    const [tabActual, setTabActual] = useState<'ingresos' | 'egresos' | 'resumen'>('resumen');

    // ==================== INGRESOS ====================
    const [modalPagoOpen, setModalPagoOpen] = useState(false);
    const [formDataPago, setFormDataPago] = useState<Omit<IPago, 'pagoId'>>({
        membresiaId: membresias.length > 0 ? membresias[0].membresiaId : 0,
        monto: 0,
        fechaPago: new Date().toISOString().split('T')[0]
    });
    const [fechaInicioIngresos, setFechaInicioIngresos] = useState('');
    const [fechaFinIngresos, setFechaFinIngresos] = useState('');
    const [busquedaCliente, setBusquedaCliente] = useState('');

    // ==================== EGRESOS ====================
    const [fechaInicioEgresos, setFechaInicioEgresos] = useState('');
    const [fechaFinEgresos, setFechaFinEgresos] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'En Curso' | 'Completado'>('todos');
    const [busquedaEquipo, setBusquedaEquipo] = useState('');

    // ==================== RESUMEN ====================
    const [periodoResumen, setPeriodoResumen] = useState<'mes' | 'año' | 'todo'>('mes');

    // ==================== FUNCIONES INGRESOS ====================
    const pagosConDetalles = pagos.map(pago => {
        const membresia = membresias.find(m => m.membresiaId === pago.membresiaId);
        const cliente = membresia ? clientes.find(c => c.id === membresia.clienteId) : null;
        return {
            ...pago,
            membresia,
            cliente
        };
    });

    const pagosFiltrados = pagosConDetalles.filter(pago => {
        const fechaPago = new Date(pago.fechaPago);
        const cumpleFechaInicio = !fechaInicioIngresos || fechaPago >= new Date(fechaInicioIngresos);
        const cumpleFechaFin = !fechaFinIngresos || fechaPago <= new Date(fechaFinIngresos + 'T23:59:59');
        const cumpleCliente = !busquedaCliente || pago.cliente?.nombreCompleto.toLowerCase().includes(busquedaCliente.toLowerCase());
        return cumpleFechaInicio && cumpleFechaFin && cumpleCliente;
    });

    const handleNuevoPago = () => {
        setFormDataPago({
            membresiaId: membresias.length > 0 ? membresias[0].membresiaId : 0,
            monto: 0,
            fechaPago: new Date().toISOString().split('T')[0]
        });
        setModalPagoOpen(true);
    };

    const handleGuardarPago = (e: React.FormEvent) => {
        e.preventDefault();
        const nuevoPago: IPago = {
            ...formDataPago,
            pagoId: Date.now()
        };
        setPagos([...pagos, nuevoPago]);
        setModalPagoOpen(false);
    };

    // ==================== FUNCIONES EGRESOS ====================
    const egresosConDetalles = mantenimientos.map(mant => {
        const equipo = equipamiento.find(eq => eq.equipoId === mant.equipoId);
        const enCurso = !mant.fechaFin;
        return {
            ...mant,
            equipo,
            estado: enCurso ? 'En Curso' : 'Completado' as const
        };
    });

    const egresosFiltrados = egresosConDetalles.filter(egreso => {
        const fechaEgreso = new Date(egreso.fechaInicio);
        const cumpleFechaInicio = !fechaInicioEgresos || fechaEgreso >= new Date(fechaInicioEgresos);
        const cumpleFechaFin = !fechaFinEgresos || fechaEgreso <= new Date(fechaFinEgresos + 'T23:59:59');
        const cumpleEstado = estadoFiltro === 'todos' || egreso.estado === estadoFiltro;
        const cumpleEquipo = !busquedaEquipo || egreso.equipo?.nombre.toLowerCase().includes(busquedaEquipo.toLowerCase());
        return cumpleFechaInicio && cumpleFechaFin && cumpleEstado && cumpleEquipo;
    });

    // ==================== FUNCIONES RESUMEN ====================
    const calcularResumen = () => {
        const hoy = new Date();
        let fechaInicio: Date;

        switch (periodoResumen) {
            case 'mes':
                fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                break;
            case 'año':
                fechaInicio = new Date(hoy.getFullYear(), 0, 1);
                break;
            default:
                fechaInicio = new Date(0);
        }

        const ingresosFiltrados = pagos.filter(p => new Date(p.fechaPago) >= fechaInicio);
        const egresosFiltrados = mantenimientos.filter(m => new Date(m.fechaInicio) >= fechaInicio);

        const totalIngresos = ingresosFiltrados.reduce((sum, p) => sum + p.monto, 0);
        const totalEgresos = egresosFiltrados.reduce((sum, m) => sum + m.costo, 0);
        const balance = totalIngresos - totalEgresos;

        return { totalIngresos, totalEgresos, balance, cantidadIngresos: ingresosFiltrados.length, cantidadEgresos: egresosFiltrados.length };
    };

    const resumen = calcularResumen();

    const obtenerUltimasTransacciones = () => {
        const transacciones: Array<{
            tipo: 'ingreso' | 'egreso';
            fecha: string;
            descripcion: string;
            monto: number;
        }> = [];

        pagos.forEach(pago => {
            const membresia = membresias.find(m => m.membresiaId === pago.membresiaId);
            const cliente = membresia ? clientes.find(c => c.id === membresia.clienteId) : null;
            transacciones.push({
                tipo: 'ingreso',
                fecha: pago.fechaPago,
                descripcion: `Pago de ${cliente?.nombreCompleto || 'N/A'}`,
                monto: pago.monto
            });
        });

        mantenimientos.forEach(mant => {
            const equipo = equipamiento.find(eq => eq.equipoId === mant.equipoId);
            transacciones.push({
                tipo: 'egreso',
                fecha: mant.fechaInicio,
                descripcion: `Mantenimiento: ${equipo?.nombre || 'N/A'}`,
                monto: mant.costo
            });
        });

        return transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 10);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-green-600" />
                        Gestión Financiera
                    </h1>
                    <p className="text-gray-600">Administra ingresos, egresos y consulta el estado financiero del gimnasio</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setTabActual('resumen')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'resumen'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    Resumen Financiero
                                </div>
                            </button>
                            <button
                                onClick={() => setTabActual('ingresos')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'ingresos'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Ingresos
                                </div>
                            </button>
                            <button
                                onClick={() => setTabActual('egresos')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'egresos'
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4" />
                                    Egresos
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* TAB 1: RESUMEN FINANCIERO */}
                        {tabActual === 'resumen' && (
                            <div className="space-y-6">
                                {/* Selector de Período */}
                                <div className="flex justify-end">
                                    <select
                                        value={periodoResumen}
                                        onChange={(e) => setPeriodoResumen(e.target.value as any)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="mes">Este Mes</option>
                                        <option value="año">Este Año</option>
                                        <option value="todo">Todo el Tiempo</option>
                                    </select>
                                </div>

                                {/* Tarjetas de Resumen */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Total Ingresos */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-green-500 rounded-full p-3">
                                                <TrendingUp className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                                                {resumen.cantidadIngresos} pagos
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-green-800 mb-1">Total Ingresos</h3>
                                        <p className="text-3xl font-bold text-green-900">${resumen.totalIngresos.toFixed(2)}</p>
                                    </div>

                                    {/* Total Egresos */}
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-red-500 rounded-full p-3">
                                                <TrendingDown className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded-full">
                                                {resumen.cantidadEgresos} gastos
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-red-800 mb-1">Total Egresos</h3>
                                        <p className="text-3xl font-bold text-red-900">${resumen.totalEgresos.toFixed(2)}</p>
                                    </div>

                                    {/* Balance */}
                                    <div className={`bg-gradient-to-br ${resumen.balance >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'} rounded-xl p-6 border`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`${resumen.balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'} rounded-full p-3`}>
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                            <span className={`text-xs font-semibold ${resumen.balance >= 0 ? 'text-blue-700 bg-blue-200' : 'text-orange-700 bg-orange-200'} px-2 py-1 rounded-full`}>
                                                {resumen.balance >= 0 ? 'Positivo' : 'Negativo'}
                                            </span>
                                        </div>
                                        <h3 className={`text-sm font-medium ${resumen.balance >= 0 ? 'text-blue-800' : 'text-orange-800'} mb-1`}>Balance</h3>
                                        <p className={`text-3xl font-bold ${resumen.balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>${resumen.balance.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Últimas Transacciones */}
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Últimas Transacciones</h3>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {obtenerUltimasTransacciones().map((trans, idx) => (
                                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`rounded-full p-2 ${trans.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                        {trans.tipo === 'ingreso' ? (
                                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{trans.descripcion}</p>
                                                        <p className="text-xs text-gray-500">{new Date(trans.fecha).toLocaleDateString('es-MX')}</p>
                                                    </div>
                                                </div>
                                                <p className={`text-sm font-semibold ${trans.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trans.tipo === 'ingreso' ? '+' : '-'}${trans.monto.toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                        {obtenerUltimasTransacciones().length === 0 && (
                                            <div className="p-8 text-center text-gray-500">
                                                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                <p>No hay transacciones registradas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: INGRESOS */}
                        {tabActual === 'ingresos' && (
                            <div className="space-y-6">
                                {/* Controles */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="flex gap-4 flex-wrap">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio</label>
                                            <input
                                                type="date"
                                                value={fechaInicioIngresos}
                                                onChange={(e) => setFechaInicioIngresos(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin</label>
                                            <input
                                                type="date"
                                                value={fechaFinIngresos}
                                                onChange={(e) => setFechaFinIngresos(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Buscar Cliente</label>
                                            <input
                                                type="text"
                                                value={busquedaCliente}
                                                onChange={(e) => setBusquedaCliente(e.target.value)}
                                                placeholder="Nombre..."
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleNuevoPago}
                                        disabled={membresias.length === 0}
                                        className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium py-2 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 disabled:opacity-50"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Registrar Pago
                                    </button>
                                </div>

                                {/* Tabla de Ingresos */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        Fecha
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        Cliente
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4" />
                                                        Tipo Membresía
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        Monto
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {pagosFiltrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <TrendingUp className="w-8 h-8 text-gray-300" />
                                                            <p>No se encontraron pagos registrados</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                pagosFiltrados.map((pago) => (
                                                    <tr key={pago.pagoId} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(pago.fechaPago).toLocaleDateString('es-MX')}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {pago.cliente?.nombreCompleto || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {pago.membresia?.tipoMembresia?.nombre || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-green-600">
                                                                ${pago.monto.toFixed(2)}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Mostrando {pagosFiltrados.length} de {pagos.length} pagos</span>
                                    <span className="font-semibold text-green-600">
                                        Total: ${pagosFiltrados.reduce((sum, p) => sum + p.monto, 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: EGRESOS */}
                        {tabActual === 'egresos' && (
                            <div className="space-y-6">
                                {/* Controles */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Nota:</strong> Los egresos se gestionan desde la página de <strong>Equipamiento → Mantenimiento</strong>. Esta vista es solo para consulta.
                                    </p>
                                </div>

                                <div className="flex gap-4 flex-wrap">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicio</label>
                                        <input
                                            type="date"
                                            value={fechaInicioEgresos}
                                            onChange={(e) => setFechaInicioEgresos(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Fin</label>
                                        <input
                                            type="date"
                                            value={fechaFinEgresos}
                                            onChange={(e) => setFechaFinEgresos(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                                        <select
                                            value={estadoFiltro}
                                            onChange={(e) => setEstadoFiltro(e.target.value as any)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            <option value="todos">Todos</option>
                                            <option value="En Curso">En Curso</option>
                                            <option value="Completado">Completado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Buscar Equipo</label>
                                        <input
                                            type="text"
                                            value={busquedaEquipo}
                                            onChange={(e) => setBusquedaEquipo(e.target.value)}
                                            placeholder="Nombre..."
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Tabla de Egresos */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        Fecha
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Equipo
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        Descripción
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        Costo
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {egresosFiltrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <TrendingDown className="w-8 h-8 text-gray-300" />
                                                            <p>No se encontraron egresos registrados</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                egresosFiltrados.map((egreso) => (
                                                    <tr key={egreso.mantenimientoId} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {new Date(egreso.fechaInicio).toLocaleDateString('es-MX')}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {egreso.equipo?.nombre || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-600 max-w-xs truncate" title={egreso.descripcion}>
                                                                {egreso.descripcion}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${egreso.estado === 'En Curso'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                                }`}>
                                                                {egreso.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-red-600">
                                                                ${egreso.costo.toFixed(2)}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Mostrando {egresosFiltrados.length} de {mantenimientos.length} egresos</span>
                                    <span className="font-semibold text-red-600">
                                        Total: ${egresosFiltrados.reduce((sum, e) => sum + e.costo, 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Nuevo Pago */}
            {modalPagoOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Registrar Pago</h2>
                            <button
                                onClick={() => setModalPagoOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleGuardarPago} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Membresía
                                </label>
                                <select
                                    required
                                    value={formDataPago.membresiaId}
                                    onChange={(e) => setFormDataPago({ ...formDataPago, membresiaId: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {membresias.map(membresia => {
                                        const cliente = clientes.find(c => c.id === membresia.clienteId);
                                        return (
                                            <option key={membresia.membresiaId} value={membresia.membresiaId}>
                                                {cliente?.nombreCompleto} - {membresia.tipoMembresia?.nombre}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monto ($)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formDataPago.monto}
                                    onChange={(e) => setFormDataPago({ ...formDataPago, monto: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Pago
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formDataPago.fechaPago}
                                    onChange={(e) => setFormDataPago({ ...formDataPago, fechaPago: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalPagoOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <DollarSign className="w-5 h-5" />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
