import { API_CONFIG } from './config';

const handleResponse = async (response, errorMessage) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorMessage || errorData.message || 'Error desconocido');
    }

    // Verificar si hay contenido en la respuesta
    const text = await response.text();
    if (!text) {
        return []; 
    }

    try {
        return JSON.parse(text);
    } catch (error) {
        return text; 
    }
};


export const getDatos = async (endpoint, errorMessage = 'Error al obtener datos') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            headers: API_CONFIG.DEFAULT_HEADERS
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};

export const postDatos = async (endpoint, data, errorMessage = 'Error al crear recurso') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(data)
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};

export const putDatos = async (endpoint, data, errorMessage = 'Error al actualizar recurso') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: API_CONFIG.DEFAULT_HEADERS,
            body: JSON.stringify(data)
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};

export const deleteDatos = async (endpoint, errorMessage = 'Error al eliminar recurso') => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: API_CONFIG.DEFAULT_HEADERS
        });
        return handleResponse(response, errorMessage);
    } catch (error) {
        throw new Error(`${errorMessage}: ${error.message}`);
    }
};