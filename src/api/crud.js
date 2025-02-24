import { API_CONFIG } from './config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};


const handleResponse = async (response, errorMessage) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorMessage || errorData.message || 'Error desconocido');
    }
    const text = await response.text();
    if (!text) return [];
    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};

  // GET
export const getDatos = async (endpoint, errorMessage = 'Error al obtener datos') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            headers: getAuthHeader()
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};

  // POST
export const postDatos = async (endpoint, data, errorMessage = 'Error al crear recurso') => {
    try {
        const headers =
            endpoint.includes('/api/auth/log-in')
                ? { 'Content-Type': 'application/json' }
                : getAuthHeader();
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};


  // PUT
export const putDatos = async (endpoint, data, errorMessage = 'Error al actualizar recurso') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(data)
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};

  // DELETE
export const deleteDatos = async (endpoint, errorMessage = 'Error al eliminar recurso') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};