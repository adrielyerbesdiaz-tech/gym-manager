const API_URL = 'http://localhost:5000/api';

export interface Cliente {
  Id: number;
  nombreCompleto: string;
  telefono: number;
  notas: string;
  fechaRegistro: string;
}

// Buscar clientes por criterio (nombre, teléfono o ID)
export const buscarClientes = async (criterio: string): Promise<Cliente[]> => {
  try {
    if (!criterio.trim()) {
      return [];
    }

    const response = await fetch(
      `${API_URL}/clientes/buscar/${encodeURIComponent(criterio)}`
    );
    
    if (!response.ok) {
      throw new Error('Error al buscar clientes');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error buscando clientes:', error);
    return [];
  }
};