import { useState, type Dispatch, type SetStateAction } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search, Wrench, Calendar, DollarSign, FileText, Dumbbell, Package } from 'lucide-react';
import type { IEquipamiento } from '../../models/IEquipamiento';
import type { IEquipoAccesorio } from '../../models/IEquipoAccesorio';
import type { IMantenimiento } from '../../models/IMantenimiento';

interface EquipamientoPaginaProps {
    equipamiento: IEquipamiento[];
    setEquipamiento: Dispatch<SetStateAction<IEquipamiento[]>>;
    accesorios: IEquipoAccesorio[];
    setAccesorios: Dispatch<SetStateAction<IEquipoAccesorio[]>>;
    mantenimientos: IMantenimiento[];
    setMantenimientos: Dispatch<SetStateAction<IMantenimiento[]>>;
}

export default function EquipamientoPagina({
    equipamiento,
    setEquipamiento,
    accesorios,
    setAccesorios,
    mantenimientos,
    setMantenimientos
}: EquipamientoPaginaProps) {
    const [tabActual, setTabActual] = useState<'equipo' | 'mantenimiento'>('equipo');

    // ==================== EQUIPO ====================
    const [searchTerm, setSearchTerm] = useState('');
    const [modalEquipoOpen, setModalEquipoOpen] = useState(false);
    const [editingEquipo, setEditingEquipo] = useState<IEquipamiento | null>(null);
    const [formDataEquipo, setFormDataEquipo] = useState<Omit<IEquipamiento, 'equipoId'>>({
        nombre: '',
        tipo: '',
        imagenUrl: '',
        descripcion: ''
    });

    // Estados para Accesorios
    const [modalAccesorioOpen, setModalAccesorioOpen] = useState(false);
    const [editingAccesorio, setEditingAccesorio] = useState<IEquipoAccesorio | null>(null);
    const [formDataAccesorio, setFormDataAccesorio] = useState<Omit<IEquipoAccesorio, 'accesorioId'>>({
        nombre: '',
        cantidad: '',
        notas: ''
    });

    // ==================== MANTENIMIENTO ====================
    const [searchMantenimiento, setSearchMantenimiento] = useState('');
    const [modalMantenimientoOpen, setModalMantenimientoOpen] = useState(false);
    const [editingMantenimiento, setEditingMantenimiento] = useState<IMantenimiento | null>(null);
    const [formDataMantenimiento, setFormDataMantenimiento] = useState<Omit<IMantenimiento, 'mantenimientoId'>>({
        equipoId: 0,
        descripcion: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: null,
        costo: 0
    });

    // ==================== EQUIPO - FUNCIONES ====================
    const equipamientoFiltrado = equipamiento.filter(equipo =>
        equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNuevoEquipo = () => {
        setEditingEquipo(null);
        setFormDataEquipo({ nombre: '', tipo: '', imagenUrl: '', descripcion: '' });
        setModalEquipoOpen(true);
    };

    const handleEditarEquipo = (equipo: IEquipamiento) => {
        setEditingEquipo(equipo);
        setFormDataEquipo({
            nombre: equipo.nombre,
            tipo: equipo.tipo,
            imagenUrl: equipo.imagenUrl,
            descripcion: equipo.descripcion
        });
        setModalEquipoOpen(true);
    };

    const handleGuardarEquipo = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingEquipo) {
            setEquipamiento(equipamiento.map(eq =>
                eq.equipoId === editingEquipo.equipoId
                    ? { ...formDataEquipo, equipoId: editingEquipo.equipoId }
                    : eq
            ));
        } else {
            const nuevoEquipo: IEquipamiento = {
                ...formDataEquipo,
                equipoId: Date.now()
            };
            setEquipamiento([...equipamiento, nuevoEquipo]);
        }
        setModalEquipoOpen(false);
    };

    const handleEliminarEquipo = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
            setEquipamiento(equipamiento.filter(eq => eq.equipoId !== id));
        }
    };

    // ==================== ACCESORIOS - FUNCIONES ====================
    const handleNuevoAccesorio = () => {
        setEditingAccesorio(null);
        setFormDataAccesorio({ nombre: '', cantidad: '', notas: '' });
        setModalAccesorioOpen(true);
    };

    const handleEditarAccesorio = (accesorio: IEquipoAccesorio) => {
        setEditingAccesorio(accesorio);
        setFormDataAccesorio({
            nombre: accesorio.nombre,
            cantidad: accesorio.cantidad,
            notas: accesorio.notas
        });
        setModalAccesorioOpen(true);
    };

    const handleGuardarAccesorio = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingAccesorio) {
            setAccesorios(accesorios.map(acc =>
                acc.accesorioId === editingAccesorio.accesorioId
                    ? { ...formDataAccesorio, accesorioId: editingAccesorio.accesorioId }
                    : acc
            ));
        } else {
            const nuevoAccesorio: IEquipoAccesorio = {
                ...formDataAccesorio,
                accesorioId: Date.now()
            };
            setAccesorios([...accesorios, nuevoAccesorio]);
        }
        setModalAccesorioOpen(false);
    };

    const handleEliminarAccesorio = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este accesorio?')) {
            setAccesorios(accesorios.filter(acc => acc.accesorioId !== id));
        }
    };

    // ==================== MANTENIMIENTO - FUNCIONES ====================
    const mantenimientosConDetalles = mantenimientos.map(mant => {
        const equipo = equipamiento.find(eq => eq.equipoId === mant.equipoId);
        const enCurso = !mant.fechaFin;

        return {
            ...mant,
            equipo,
            enCurso
        };
    });

    const mantenimientosFiltrados = mantenimientosConDetalles.filter(mant =>
        mant.equipo?.nombre.toLowerCase().includes(searchMantenimiento.toLowerCase()) ||
        mant.descripcion.toLowerCase().includes(searchMantenimiento.toLowerCase())
    );

    const handleNuevoMantenimiento = () => {
        setEditingMantenimiento(null);
        setFormDataMantenimiento({
            equipoId: equipamiento.length > 0 ? equipamiento[0].equipoId : 0,
            descripcion: '',
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: null,
            costo: 0
        });
        setModalMantenimientoOpen(true);
    };

    const handleEditarMantenimiento = (mantenimiento: IMantenimiento) => {
        setEditingMantenimiento(mantenimiento);
        setFormDataMantenimiento({
            equipoId: mantenimiento.equipoId,
            descripcion: mantenimiento.descripcion,
            fechaInicio: mantenimiento.fechaInicio,
            fechaFin: mantenimiento.fechaFin,
            costo: mantenimiento.costo
        });
        setModalMantenimientoOpen(true);
    };

    const handleGuardarMantenimiento = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingMantenimiento) {
            setMantenimientos(mantenimientos.map(mant =>
                mant.mantenimientoId === editingMantenimiento.mantenimientoId
                    ? { ...formDataMantenimiento, mantenimientoId: editingMantenimiento.mantenimientoId }
                    : mant
            ));
        } else {
            const nuevoMantenimiento: IMantenimiento = {
                ...formDataMantenimiento,
                mantenimientoId: Date.now()
            };
            setMantenimientos([...mantenimientos, nuevoMantenimiento]);
        }
        setModalMantenimientoOpen(false);
    };

    const handleEliminarMantenimiento = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este mantenimiento?')) {
            setMantenimientos(mantenimientos.filter(mant => mant.mantenimientoId !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Equipamiento</h1>
                    <p className="text-gray-600">Administra equipos, accesorios y mantenimientos</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setTabActual('equipo')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'equipo'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Dumbbell className="w-4 h-4" />
                                    Equipamiento
                                </div>
                            </button>
                            <button
                                onClick={() => setTabActual('mantenimiento')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'mantenimiento'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Wrench className="w-4 h-4" />
                                    Mantenimiento
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* TAB 1: EQUIPAMIENTO */}
                        {tabActual === 'equipo' && (
                            <div className="space-y-6">
                                {/* Barra de controles */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="relative w-full sm:w-96">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o tipo..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleNuevoEquipo}
                                            className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium py-2 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Nuevo Equipo
                                        </button>
                                        <button
                                            onClick={handleNuevoAccesorio}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                                        >
                                            <Package className="w-5 h-5" />
                                            Nuevo Accesorio
                                        </button>
                                    </div>
                                </div>

                                {/* Sección Equipos */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Dumbbell className="w-5 h-5 text-red-600" />
                                        Equipos
                                    </h2>
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Tipo
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Descripción
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Imagen
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {equipamientoFiltrado.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Dumbbell className="w-8 h-8 text-gray-300" />
                                                                <p>No se encontraron equipos</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    equipamientoFiltrado.map((equipo) => (
                                                        <tr key={equipo.equipoId} className="hover:bg-gray-50 transition-colors group">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {equipo.nombre}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                    {equipo.tipo}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-600 max-w-xs truncate" title={equipo.descripcion}>
                                                                    {equipo.descripcion || <span className="text-gray-400 italic">Sin descripción</span>}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {equipo.imagenUrl ? (
                                                                    <img
                                                                        src={equipo.imagenUrl}
                                                                        alt={equipo.nombre}
                                                                        className="w-12 h-12 object-cover rounded-lg"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                        <Dumbbell className="w-6 h-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-3">
                                                                    <button
                                                                        onClick={() => handleEditarEquipo(equipo)}
                                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEliminarEquipo(equipo.equipoId)}
                                                                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Sección Accesorios */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        Accesorios
                                    </h2>
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Cantidad
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Notas
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {accesorios.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Package className="w-8 h-8 text-gray-300" />
                                                                <p>No hay accesorios registrados</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    accesorios.map((accesorio) => (
                                                        <tr key={accesorio.accesorioId} className="hover:bg-gray-50 transition-colors group">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {accesorio.nombre}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-600">
                                                                    {accesorio.cantidad}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-600 max-w-xs truncate" title={accesorio.notas}>
                                                                    {accesorio.notas || <span className="text-gray-400 italic">Sin notas</span>}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-3">
                                                                    <button
                                                                        onClick={() => handleEditarAccesorio(accesorio)}
                                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEliminarAccesorio(accesorio.accesorioId)}
                                                                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-sm text-gray-500 text-center">
                                    {equipamiento.length} equipos • {accesorios.length} accesorios
                                </div>
                            </div>
                        )}

                        {/* TAB 2: MANTENIMIENTO */}
                        {tabActual === 'mantenimiento' && (
                            <div className="space-y-6">
                                {/* Barra de controles */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                    <div className="relative w-full sm:w-96">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Buscar mantenimientos..."
                                            value={searchMantenimiento}
                                            onChange={(e) => setSearchMantenimiento(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>

                                    <button
                                        onClick={handleNuevoMantenimiento}
                                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium py-2 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                        disabled={equipamiento.length === 0}
                                    >
                                        <Plus className="w-5 h-5" />
                                        Nuevo Mantenimiento
                                    </button>
                                </div>

                                {equipamiento.length === 0 ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                        <Dumbbell className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                                        <p className="text-yellow-800 font-medium mb-2">No hay equipos registrados</p>
                                        <p className="text-yellow-700 text-sm">
                                            Debes agregar equipos antes de registrar mantenimientos
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Dumbbell className="w-4 h-4" /> Equipo
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4" /> Descripción
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" /> Fecha Inicio
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" /> Fecha Fin
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="w-4 h-4" /> Costo
                                                        </div>
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
                                                {mantenimientosFiltrados.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Wrench className="w-8 h-8 text-gray-300" />
                                                                <p>No se encontraron mantenimientos</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    mantenimientosFiltrados.map((mantenimiento) => (
                                                        <tr key={mantenimiento.mantenimientoId} className="hover:bg-gray-50 transition-colors group">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {mantenimiento.equipo?.nombre || 'N/A'}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {mantenimiento.equipo?.tipo}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm text-gray-600 max-w-xs truncate" title={mantenimiento.descripcion}>
                                                                    {mantenimiento.descripcion}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-600">
                                                                    {mantenimiento.fechaInicio}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-600">
                                                                    {mantenimiento.fechaFin || <span className="text-gray-400 italic">En curso</span>}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    ${mantenimiento.costo.toFixed(2)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mantenimiento.enCurso
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                    {mantenimiento.enCurso ? 'En Curso' : 'Completado'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-3">
                                                                    <button
                                                                        onClick={() => handleEditarMantenimiento(mantenimiento)}
                                                                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEliminarMantenimiento(mantenimiento.mantenimientoId)}
                                                                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="text-sm text-gray-500 text-center">
                                    Mostrando {mantenimientosFiltrados.length} de {mantenimientos.length} mantenimientos
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Nuevo/Editar Equipo */}
            {modalEquipoOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingEquipo ? 'Editar Equipo' : 'Nuevo Equipo'}
                            </h2>
                            <button
                                onClick={() => setModalEquipoOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGuardarEquipo} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Equipo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formDataEquipo.nombre}
                                    onChange={(e) => setFormDataEquipo({ ...formDataEquipo, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Barra olímpica"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formDataEquipo.tipo}
                                    onChange={(e) => setFormDataEquipo({ ...formDataEquipo, tipo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Pesas libres"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL de Imagen (opcional)
                                </label>
                                <input
                                    type="url"
                                    value={formDataEquipo.imagenUrl}
                                    onChange={(e) => setFormDataEquipo({ ...formDataEquipo, imagenUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción (opcional)
                                </label>
                                <textarea
                                    value={formDataEquipo.descripcion}
                                    onChange={(e) => setFormDataEquipo({ ...formDataEquipo, descripcion: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                    placeholder="Detalles del equipo..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalEquipoOpen(false)}
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

            {/* Modal Nuevo/Editar Accesorio */}
            {modalAccesorioOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingAccesorio ? 'Editar Accesorio' : 'Nuevo Accesorio'}
                            </h2>
                            <button
                                onClick={() => setModalAccesorioOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGuardarAccesorio} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Accesorio
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formDataAccesorio.nombre}
                                    onChange={(e) => setFormDataAccesorio({ ...formDataAccesorio, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Mancuernas 5kg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cantidad
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formDataAccesorio.cantidad}
                                    onChange={(e) => setFormDataAccesorio({ ...formDataAccesorio, cantidad: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: 10 pares"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notas (opcional)
                                </label>
                                <textarea
                                    value={formDataAccesorio.notas}
                                    onChange={(e) => setFormDataAccesorio({ ...formDataAccesorio, notas: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                    placeholder="Información adicional..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalAccesorioOpen(false)}
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

            {/* Modal Nuevo/Editar Mantenimiento */}
            {modalMantenimientoOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingMantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
                            </h2>
                            <button
                                onClick={() => setModalMantenimientoOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGuardarMantenimiento} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Equipo
                                </label>
                                <select
                                    required
                                    value={formDataMantenimiento.equipoId}
                                    onChange={(e) => setFormDataMantenimiento({ ...formDataMantenimiento, equipoId: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {equipamiento.map(equipo => (
                                        <option key={equipo.equipoId} value={equipo.equipoId}>
                                            {equipo.nombre} ({equipo.tipo})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción del Mantenimiento
                                </label>
                                <textarea
                                    required
                                    value={formDataMantenimiento.descripcion}
                                    onChange={(e) => setFormDataMantenimiento({ ...formDataMantenimiento, descripcion: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                    placeholder="Describe el mantenimiento realizado o a realizar..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formDataMantenimiento.fechaInicio}
                                        onChange={(e) => setFormDataMantenimiento({ ...formDataMantenimiento, fechaInicio: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha Fin (opcional)
                                    </label>
                                    <input
                                        type="date"
                                        value={formDataMantenimiento.fechaFin || ''}
                                        onChange={(e) => setFormDataMantenimiento({ ...formDataMantenimiento, fechaFin: e.target.value || null })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Costo ($)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formDataMantenimiento.costo}
                                    onChange={(e) => setFormDataMantenimiento({ ...formDataMantenimiento, costo: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalMantenimientoOpen(false)}
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
        </div>
    );
}
