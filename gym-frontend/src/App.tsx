import { useState } from 'react';
import AsistenciaPagina from './pages/asistencias/AsistenciaPagina';
import ClientesPagina from './pages/clientes/ClientesPagina';
import EquipamientoPagina from './pages/equipamiento/EquipamientoPagina';
import FinanzasPagina from './pages/finanzas/FinanzasPagina';
import ConfiguracionesPagina from './pages/configuraciones/ConfiguracionesPagina';
import LoginPagina from './pages/login/LoginPagina';
import { LogOut } from 'lucide-react';

// Definición de Interfaces compartidas (Alineadas con los componentes refactorizados)

export interface Cliente {
  Id: number;
  nombreCompleto: string;
  telefono: number;
  notas: string;
  fechaRegistro: string | Date; // Ajustado para compatibilidad
}

export interface TipoMembresia {
  tipoMembresiaID: number;
  nombre: string;
  duracionDias: number;
  precio: number;
}

export interface Membresia {
  membresiaId: number;
  tipoMembresiaID: number;
  usuarioID: number;
  fechaInicio: string | Date; // Ajustado
  estado: 'Activa' | 'Vencida';
  // Propiedades opcionales para facilitar uniones en vistas
  tipoMembresia?: TipoMembresia;
  cliente?: Cliente;
}

export interface Asistencia {
  asistenciaId: number;
  clienteID: number;
  fechaCheckIn: string | Date; // Ajustado
  // Propiedades opcionales para vistas
  cliente?: Cliente;
  membresia?: Membresia;
  tipoMembresia?: TipoMembresia;
}

export interface Equipamiento {
  equipoId: number;
  nombre: string;
  tipo: string;
  imagenUrl?: string; // Opcional para compatibilidad
  descripcion: string;
}

export interface EquipoAccesorio {
  accesorioId: number;
  nombre: string;
  cantidad: string;
  notas: string;
}

export interface Mantenimiento {
  mantenimientoId: number;
  equipoID: number;
  descripcion: string;
  fechaInicio: string | Date; // Ajustado
  fechaFin: string | Date | null; // Ajustado
  costo: number;
  equipo?: Equipamiento;
  enCurso?: boolean; // Añadido para compatibilidad con la vista de Mantenimiento
}

export interface Pago {
  pagoId: number;
  membresiaID: number;
  monto: number;
  fechaPago: string | Date; // Ajustado
  membresia?: Membresia;
  cliente?: Cliente;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [paginaActual, setPaginaActual] = useState<'asistencias' | 'clientes' | 'equipamiento' | 'finanzas' | 'configuraciones'>('asistencias');

  // Estado de contraseña (hardcoded para demo)
  const [currentPassword, setCurrentPassword] = useState('admin123');

  // Estado global para clientes
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      Id: 1,
      nombreCompleto: 'Juan Pérez',
      telefono: 9999026122,
      fechaRegistro: '2024-01-15',
      notas: 'Cliente regular, prefiere turno matutino'
    },
    {
      Id: 2,
      nombreCompleto: 'María González',
      telefono: 9991234567,
      fechaRegistro: '2024-02-20',
      notas: 'Pago pendiente de mensualidad'
    }
  ]);

  // Tipos de membresía
  const [tiposMembresia, setTiposMembresia] = useState<TipoMembresia[]>([
    { tipoMembresiaID: 1, nombre: 'Mensual', duracionDias: 30, precio: 500 },
    { tipoMembresiaID: 2, nombre: 'Trimestral', duracionDias: 90, precio: 1350 },
    { tipoMembresiaID: 3, nombre: 'Semestral', duracionDias: 180, precio: 2500 },
    { tipoMembresiaID: 4, nombre: 'Anual', duracionDias: 365, precio: 4500 }
  ]);

  // Membresías
  const [membresias, setMembresias] = useState<Membresia[]>([
    {
      membresiaId: 1,
      tipoMembresiaID: 1,
      usuarioID: 1,
      fechaInicio: '2024-11-01',
      estado: 'Activa'
    },
    {
      membresiaId: 2,
      tipoMembresiaID: 2,
      usuarioID: 2,
      fechaInicio: '2024-10-15',
      estado: 'Vencida'
    }
  ]);

  // Asistencias
  const [asistencias, setAsistencias] = useState<Asistencia[]>([
    { asistenciaId: 1, clienteID: 1, fechaCheckIn: '2024-11-20T08:30:00' },
    { asistenciaId: 2, clienteID: 1, fechaCheckIn: '2024-11-21T09:15:00' },
    { asistenciaId: 3, clienteID: 2, fechaCheckIn: '2024-11-22T10:00:00' }
  ]);

  // Equipamiento
  const [equipamiento, setEquipamiento] = useState<Equipamiento[]>([
    {
      equipoId: 1,
      nombre: 'Barra Olímpica 20kg',
      tipo: 'Pesas libres',
      imagenUrl: '',
      descripcion: 'Barra olímpica estándar de 20kg para levantamiento de pesas'
    },
    {
      equipoId: 2,
      nombre: 'Caminadora Profesional',
      tipo: 'Cardio',
      imagenUrl: '',
      descripcion: 'Caminadora con velocidad variable y monitor de ritmo cardíaco'
    }
  ]);

  // Accesorios
  const [accesorios, setAccesorios] = useState<EquipoAccesorio[]>([
    {
      accesorioId: 1,
      nombre: 'Mancuernas 5kg',
      cantidad: '10 pares',
      notas: 'En buen estado'
    },
    {
      accesorioId: 2,
      nombre: 'Bandas de resistencia',
      cantidad: '15 unidades',
      notas: 'Diferentes niveles de resistencia'
    }
  ]);

  // Mantenimientos
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([
    {
      mantenimientoId: 1,
      equipoID: 1,
      descripcion: 'Lubricación de rodamientos y ajuste general',
      fechaInicio: '2024-11-01',
      fechaFin: '2024-11-01',
      costo: 150.00,
      enCurso: false
    },
    {
      mantenimientoId: 2,
      equipoID: 2,
      descripcion: 'Revisión de motor y calibración de sensores',
      fechaInicio: '2024-11-15',
      fechaFin: null,
      costo: 300.00,
      enCurso: true
    }
  ]);

  // Pagos
  const [pagos, setPagos] = useState<Pago[]>([
    {
      pagoId: 1,
      membresiaID: 1,
      monto: 500.00,
      fechaPago: '2024-11-05'
    },
    {
      pagoId: 2,
      membresiaID: 2,
      monto: 1350.00,
      fechaPago: '2024-10-20'
    },
    {
      pagoId: 3,
      membresiaID: 1,
      monto: 500.00,
      fechaPago: '2024-12-01'
    }
  ]);

  const handleLogin = (nombreUsuario: string, contrasenia: string): boolean => {
    // Validación hardcoded para demo
    if (nombreUsuario === 'admin' && contrasenia === currentPassword) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setPaginaActual('clientes'); // Ir directamente a clientes después del login
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPaginaActual('asistencias');
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCancelLogin = () => {
    setShowLogin(false);
  };

  // Handler para registrar asistencia
  const handleRegisterAttendance = (nombreCompleto: string) => {
    const cliente = clientes.find(c => c.nombreCompleto.toLowerCase() === nombreCompleto.toLowerCase());
    if (!cliente) {
      alert('Cliente no encontrado');
      return;
    }

    const nuevaAsistencia: Asistencia = {
      asistenciaId: Date.now(),
      clienteID: cliente.Id,
      fechaCheckIn: new Date().toISOString()
    };

    setAsistencias([nuevaAsistencia, ...asistencias]);
    // En una app real, aquí mostraríamos un toast o mensaje de éxito
  };

  // Handler para cambiar contraseña
  const handlePasswordChange = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === currentPassword) {
      setCurrentPassword(newPassword);
      return true;
    }
    return false;
  };

  if (showLogin) {
    return <LoginPagina onLogin={handleLogin} onCancel={handleCancelLogin} />;
  }

  return (
    <div>
      {/* Navigation Bar - Solo visible si está autenticado */}
      {isAuthenticated && (
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setPaginaActual('asistencias')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${paginaActual === 'asistencias'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Asistencias
                </button>
                <button
                  onClick={() => setPaginaActual('clientes')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${paginaActual === 'clientes'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Clientes
                </button>
                <button
                  onClick={() => setPaginaActual('equipamiento')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${paginaActual === 'equipamiento'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Equipamiento
                </button>
                <button
                  onClick={() => setPaginaActual('finanzas')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${paginaActual === 'finanzas'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Finanzas
                </button>
                <button
                  onClick={() => setPaginaActual('configuraciones')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${paginaActual === 'configuraciones'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Configuraciones
                </button>
              </div>

              {/* Botón de logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 ml-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      {isAuthenticated ? (
        <div className="p-4">
          {paginaActual === 'asistencias' ? (
            <AsistenciaPagina
              onLoginClick={undefined} // Ya logueado, no mostramos botón login
              onRegistrarAsistencia={handleRegisterAttendance}
            />
          ) : paginaActual === 'clientes' ? (
            // @ts-ignore
            <ClientesPagina
              clientes={clientes}
              setClientes={setClientes}
              asistencias={asistencias}
              membresias={membresias}
              setMembresias={setMembresias}
              tiposMembresia={tiposMembresia}
              pagos={pagos}
              setPagos={setPagos}
            />
          ) : paginaActual === 'equipamiento' ? (
            // @ts-ignore
            <EquipamientoPagina
              equipamiento={equipamiento}
              setEquipamiento={setEquipamiento}
              accesorios={accesorios}
              setAccesorios={setAccesorios}
              mantenimientos={mantenimientos}
              setMantenimientos={setMantenimientos}
            />
          ) : paginaActual === 'finanzas' ? (
            // @ts-ignore
            <FinanzasPagina
              pagos={pagos}
              setPagos={setPagos}
              mantenimientos={mantenimientos}
              membresias={membresias}
              equipamiento={equipamiento}
              clientes={clientes}
            />
          ) : (
            // @ts-ignore
            <ConfiguracionesPagina
              tiposMembresia={tiposMembresia}
              setTiposMembresia={setTiposMembresia}
              onCambiarContrasenia={handlePasswordChange}
            />
          )}
        </div>
      ) : (
        <AsistenciaPagina
          onLoginClick={handleLoginClick}
          onRegistrarAsistencia={handleRegisterAttendance}
        />
      )}
    </div>
  );
}

export default App;