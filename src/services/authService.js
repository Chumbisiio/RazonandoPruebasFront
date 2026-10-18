import api from "../api/axios";

export const authService = {
    async login(loginData) {
        const { data: loginResponse } = await api.post('auth/login', loginData);

        localStorage.setItem('authResponse', JSON.stringify(loginResponse));
        if (loginResponse.token) {
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('typeToken', loginResponse.typeToken || 'Bearer');
        }

        return loginResponse;
    },

    logout() {
        localStorage.removeItem('authResponse');
        localStorage.removeItem('token');
        localStorage.removeItem('typeToken');
        localStorage.removeItem('activeRole');
    },

    async register(registerData) {
        const { data: registerResponse } = await api.post('auth/register', registerData);
        return registerResponse;
    }
}