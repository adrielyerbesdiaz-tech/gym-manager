import { useState, type Dispatch, type SetStateAction } from 'react';
import { Settings, Edit2, Trash2, X, Check, Plus, DollarSign, Calendar, FileText, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { ITipoMembresia } from '../models/ITipoMembresia';
import { TipoMembresiaApi } from '../api/rutas/ApiTipoMembresia';

interface ConfiguracionesPaginaProps {
    tiposMembresia: ITipoMembresia[];
    setTiposMembresia: Dispatch<SetStateAction<ITipoMembresia[]>>;
    onPasswordChange?: (oldPassword: string, newPassword: string) => boolean;
}

export default function ConfiguracionesPagina({
    tiposMembresia,
    setTiposMembresia,
    onPasswordChange
}: ConfiguracionesPaginaProps) {
    const [tabActual, setTabActual] = useState<'membresias' | 'password'>('membresias');
    const [loading, setLoading] = useState(false);

    // Función para recargar la lista de Tipos de Membresía
    const recargarTiposMembresia = async () => {
        setLoading(true);
        try {
            const data = await TipoMembresiaApi.obtenerTiposMembresia();
            setTiposMembresia(data);
        } catch (error) {
            console.error('Error al recargar tipos de membresía:', error);
            alert(`Error al cargar tipos de membresía: ${error instanceof Error ? error.message : 'Desconocido'}`);
        } finally {
            setLoading(false);
        }
    }

    // ==================== GESTIÓN DE MEMBRESÍAS ====================
    const [modalMembresiaOpen, setModalMembresiaOpen] = useState(false);
    const [editingMembresia, setEditingMembresia] = useState<ITipoMembresia | null>(null);
    const [formDataMembresia, setFormDataMembresia] = useState<Omit<ITipoMembresia, 'tipoMembresiaId'>>({
        nombre: '',
        duracionValor: 1,
        duracionTipo: 'meses',
        precio: 0
    });

    const handleNuevaMembresia = () => {
        setEditingMembresia(null);
        setFormDataMembresia({ 
            nombre: '', 
            duracionValor: 1, 
            duracionTipo: 'meses', 
            precio: 0 
        });
        setModalMembresiaOpen(true);
    };

    const handleEditarMembresia = (membresia: ITipoMembresia) => {
        setEditingMembresia(membresia);
        setFormDataMembresia({
            nombre: membresia.nombre,
            duracionValor: membresia.duracionValor,
            duracionTipo: membresia.duracionTipo,
            precio: membresia.precio
        });
        setModalMembresiaOpen(true);
    };

    const handleGuardarMembresia = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingMembresia) {
                // ACTUALIZAR
                await TipoMembresiaApi.actualizarTipoMembresia(
                    editingMembresia.tipoMembresiaId, 
                    formDataMembresia
                );
            } else {
                // CREAR NUEVA
                const nuevoTipo = await TipoMembresiaApi.crearTipoMembresia(formDataMembresia);
                console.log(`Tipo de Membresía creado con ID: ${nuevoTipo.id}`);
            }
            
            // Recargar la lista desde el servidor después de la operación
            await recargarTiposMembresia();
            setModalMembresiaOpen(false);
            
        } catch (error) {
            console.error('Error guardando tipo de membresía:', error);
            alert(`Error al guardar tipo de membresía: ${error instanceof Error ? error.message : 'Desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarMembresia = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este tipo de membresía?')) {
            setLoading(true);
            try {
                await TipoMembresiaApi.eliminarTipoMembresia(id);
                // Recargar desde el servidor en lugar de actualizar localmente
                await recargarTiposMembresia();
            } catch (error) {
                console.error('Error eliminando tipo de membresía:', error);
                alert(`Error al eliminar tipo de membresía: ${error instanceof Error ? error.message : 'Desconocido'}`);
            } finally {
                setLoading(false);
            }
        }
    };

    // ==================== CAMBIO DE CONTRASEÑA ====================
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        // Validaciones
        if (passwordData.newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        if (passwordData.currentPassword === passwordData.newPassword) {
            setPasswordError('La nueva contraseña debe ser diferente a la actual');
            return;
        }

        // Llamar al callback de cambio de contraseña
        if (onPasswordChange) {
            const success = onPasswordChange(passwordData.currentPassword, passwordData.newPassword);
            if (success) {
                setPasswordSuccess(true);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => setPasswordSuccess(false), 5000);
            } else {
                setPasswordError('La contraseña actual es incorrecta');
            }
        }
    };

    // Función para calcular la duración en días para mostrar en la tabla
    const calcularDuracionEnDias = (duracionValor: number, duracionTipo: string): number => {
        switch(duracionTipo) {
            case 'dias':
                return duracionValor;
            case 'semanas':
                return duracionValor * 7;
            case 'meses':
                return duracionValor * 30; // Aproximado
            default:
                return duracionValor;
        }
    };

    // Función para formatear la duración para mostrar
    const formatearDuracion = (membresia: ITipoMembresia): string => {
        const dias = calcularDuracionEnDias(membresia.duracionValor, membresia.duracionTipo);
        return `${membresia.duracionValor} ${membresia.duracionTipo} (${dias} días)`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {loading && (
                // Overlay de carga
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
                </div>
            )}
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-red-600" />
                        Configuraciones
                    </h1>
                    <p className="text-gray-600">Administra tipos de membresía y seguridad de la cuenta</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setTabActual('membresias')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'membresias'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Tipos de Membresía
                                </div>
                            </button>
                            <button
                                onClick={() => setTabActual('password')}
                                className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${tabActual === 'password'
                                        ? 'border-red-500 text-red-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Cambiar Contraseña
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* TAB 1: TIPOS DE MEMBRESÍA */}
                        {tabActual === 'membresias' && (
                            <div className="space-y-6">
                                {/* Barra de controles */}
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Gestiona los tipos de membresía disponibles en el gimnasio
                                    </p>
                                    <button
                                        onClick={handleNuevaMembresia}
                                        className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium py-2 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Nueva Membresía
                                    </button>
                                </div>

                                {/* Tabla de tipos de membresía */}
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        Nombre
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        Precio
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        Duración
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {tiposMembresia.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <FileText className="w-8 h-8 text-gray-300" />
                                                            <p>No hay tipos de membresía registrados</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                tiposMembresia.map((membresia) => (
                                                    <tr key={membresia.tipoMembresiaId} className="hover:bg-gray-50 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {membresia.nombre}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-semibold text-green-600">
                                                                ${membresia.precio.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {formatearDuracion(membresia)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end gap-3">
                                                                <button
                                                                    onClick={() => handleEditarMembresia(membresia)}
                                                                    className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-md hover:bg-blue-50"
                                                                    title="Editar"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEliminarMembresia(membresia.tipoMembresiaId)}
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

                                {/* Footer */}
                                <div className="text-sm text-gray-500 text-center">
                                    Total de tipos de membresía: {tiposMembresia.length}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: CAMBIAR CONTRASEÑA */}
                        {tabActual === 'password' && (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-lg border border-gray-200 p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            Cambiar Contraseña
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Por seguridad, asegúrate de usar una contraseña segura y única.
                                        </p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-5">
                                        {/* Contraseña Actual */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contraseña Actual
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    required
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ingresa tu contraseña actual"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Nueva Contraseña */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nueva Contraseña
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    required
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ingresa tu nueva contraseña"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Debe tener al menos 6 caracteres
                                            </p>
                                        </div>

                                        {/* Confirmar Nueva Contraseña */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Nueva Contraseña
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Confirma tu nueva contraseña"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mensajes de Error/Éxito */}
                                        {passwordError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <p className="text-sm text-red-800">
                                                    <strong>Error:</strong> {passwordError}
                                                </p>
                                            </div>
                                        )}

                                        {passwordSuccess && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <p className="text-sm text-green-800">
                                                    <strong>¡Éxito!</strong> Tu contraseña ha sido actualizada correctamente.
                                                </p>
                                            </div>
                                        )}

                                        {/* Botón Guardar */}
                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium py-3 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                            >
                                                <Lock className="w-5 h-5" />
                                                Actualizar Contraseña
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Nueva/Editar Membresía */}
            {modalMembresiaOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingMembresia ? 'Editar Tipo de Membresía' : 'Nuevo Tipo de Membresía'}
                            </h2>
                            <button
                                onClick={() => setModalMembresiaOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleGuardarMembresia} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la Membresía
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formDataMembresia.nombre}
                                    onChange={(e) => setFormDataMembresia({ ...formDataMembresia, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Mensual, Trimestral, Anual"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio ($)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formDataMembresia.precio}
                                    onChange={(e) => setFormDataMembresia({ ...formDataMembresia, precio: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duración (valor)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formDataMembresia.duracionValor}
                                        onChange={(e) => setFormDataMembresia(prev => ({
                                            ...prev,
                                            duracionValor: Number(e.target.value)
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de duración
                                    </label>
                                    <select
                                        required
                                        value={formDataMembresia.duracionTipo}
                                        onChange={(e) => setFormDataMembresia(prev => ({
                                            ...prev,
                                            duracionTipo: e.target.value
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="dias">Días</option>
                                        <option value="semanas">Semanas</option>
                                        <option value="meses">Meses</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <strong>Duración total:</strong> {calcularDuracionEnDias(formDataMembresia.duracionValor, formDataMembresia.duracionTipo)} días
                                </p>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalMembresiaOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Guardar
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}