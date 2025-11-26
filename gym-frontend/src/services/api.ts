// Base API configuration and helper functions
const API_BASE_URL = 'http://localhost:5000/api';

async function apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any
): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string) => apiCall<T>(endpoint, 'GET'),
    post: <T>(endpoint: string, body: any) => apiCall<T>(endpoint, 'POST', body),
    put: <T>(endpoint: string, body: any) => apiCall<T>(endpoint, 'PUT', body),
    patch: <T>(endpoint: string, body: any) => apiCall<T>(endpoint, 'PATCH', body),
    delete: <T>(endpoint: string) => apiCall<T>(endpoint, 'DELETE'),
};
