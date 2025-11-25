const API_URL = 'http://localhost:5000/api';

export interface Cliente {
  Id: number;
  nombreCompleto: string;
  telefono: number;
  notas: string;
  fechaRegistro: string;
}

// ==================== CLIENTES ====================

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

export const obtenerTodosClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await fetch(`${API_URL}/clientes`);
    
    if (!response.ok) {
      throw new Error('Error al obtener clientes');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

// ==================== ASISTENCIAS ====================

export const registrarAsistencia = async (clienteId: number) => {
  try {
    const response = await fetch(`${API_URL}/asistencias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clienteId }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar asistencia');
    }
    
    return data;
  } catch (error) {
    console.error('Error registrando asistencia:', error);
    throw error;
  }
};

export const verificarAsistenciaHoy = async (clienteId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/asistencias/verificar/${clienteId}`);
    const data = await response.json();
    return data.yaRegistro;
  } catch (error) {
    console.error('Error verificando asistencia:', error);
    return false;
  }
};