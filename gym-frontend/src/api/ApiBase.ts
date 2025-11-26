const API_BASE_URL = 'http://localhost:5000/api';

// Función mejorada para manejar respuestas
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Si no se puede parsear JSON, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// Cliente HTTP base
export class ApiBase {
  static async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  }

  static async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  static async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  static async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  static async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
}