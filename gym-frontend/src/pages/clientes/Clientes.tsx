import { useState, useEffect } from 'react';
import { Check, Menu, X, User } from 'lucide-react';

interface Client {
  id: number;
  nombre: string;
  telefono: string;
}

// Dummy data for testing
const dummyClients: Client[] = [
  { id: 1, nombre: 'Juan Pérez', telefono: '5551234567' },
  { id: 2, nombre: 'María González', telefono: '5559876543' },
  { id: 3, nombre: 'Carlos Rodríguez', telefono: '5555551234' },
  { id: 4, nombre: 'Ana Martínez', telefono: '5554443322' },
  { id: 5, nombre: 'Luis Hernández', telefono: '5556667788' },
  { id: 6, nombre: 'Sofia López', telefono: '5552223344' },
  { id: 7, nombre: 'Miguel Torres', telefono: '5558889900' },
  { id: 8, nombre: 'Carmen Flores', telefono: '5551112233' },
];

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredClients([]);
      setShowDropdown(false);
      setSelectedClient(null);
      return;
    }

    // Filter clients based on search text
    const filtered = dummyClients.filter(client => 
      client.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      client.telefono.includes(searchText) ||
      client.id.toString().includes(searchText)
    );

    setFilteredClients(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchText]);

  const handleSelectClient = (client:Client) => {
    setSearchText(client.nombre);
    setSelectedClient(client);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Hamburger Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close button */}
          <button 
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>

          {/* User/Login section */}
          <div className="flex items-center gap-3 mb-8 pt-2">
            <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
              <User size={24} className="text-orange-500" />
            </div>
            <span className="text-lg font-medium text-gray-700">Iniciar Sesión</span>
          </div>

          {/* Menu items */}
          <nav className="space-y-4">
            <a 
              href="#clientes" 
              className="block py-3 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
            >
              Clientes
            </a>
            <a 
              href="#equipamiento" 
              className="block py-3 px-4 text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg transition-colors"
            >
              Equipamiento
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with hamburger */}
        <div className="p-6">
          <button 
            onClick={() => setMenuOpen(true)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu size={32} />
          </button>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-2xl">
            <h1 className="text-5xl font-light text-center mb-4 text-gray-800" style={{ fontFamily: 'cursive' }}>
              Bienvenido
            </h1>
            <h2 className="text-4xl font-light text-center mb-12 text-gray-700" style={{ fontFamily: 'cursive' }}>
              Registra tu asistencia
            </h2>

            {/* Search Box */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="¿Quien eres?"
                  className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-300 transition-colors"
                  style={{ fontFamily: 'cursive' }}
                />
                
                {/* Check mark when client is selected */}
                {selectedClient && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center">
                      <Check size={24} className="text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && !selectedClient && (
                <div className="absolute w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-30">
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className="px-6 py-4 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">{client.nombre}</div>
                      <div className="text-sm text-gray-500">Tel: {client.telefono} • ID: {client.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected client confirmation */}
            {selectedClient && (
              <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-orange-300 hover:bg-orange-400 text-white rounded-lg text-lg font-medium transition-colors">
                  Registrar Asistencia
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;