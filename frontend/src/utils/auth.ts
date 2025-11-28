import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwtToken";

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    console.log(token)
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded: JwtPayload = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp > now;
    } catch(err){
        return false;
    }
}