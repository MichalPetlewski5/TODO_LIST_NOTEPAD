import { getToken, removeToken, setToken } from "./auth";

const BASE_URL = "/api";

interface ApiOptions extends RequestInit {
    refreshOnFail?: boolean;
}

export const api = async (endpoint: string, options: ApiOptions = {}) => {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {...options, headers})

    if (!response.ok){
        const errorData = await response.json().catch(() => ({}));
        throw {status: response.status, ...errorData};
    }

    return response.json();
};