export const AUTH_KEY = "isLoggedIn";
export const ACC_ID_KEY = "accID";

export function setAuth(id: string, remember: boolean){
    if (remember){
        localStorage.setItem(AUTH_KEY, "true");
        localStorage.setItem(ACC_ID_KEY, id);
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(ACC_ID_KEY);
    } else{
        sessionStorage.setItem(AUTH_KEY, "true");
        sessionStorage.setItem(ACC_ID_KEY, id);
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(ACC_ID_KEY);
    }
}

export function isAuthenticated(): boolean {
    return(
        localStorage.getItem(AUTH_KEY) === "true" ||
        sessionStorage.getItem(AUTH_KEY) === "true"
    );
}

export function getUserId(): string | null {
    return localStorage.getItem(ACC_ID_KEY) || sessionStorage.getItem(ACC_ID_KEY);
}

export function logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ACC_ID_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(ACC_ID_KEY);
}