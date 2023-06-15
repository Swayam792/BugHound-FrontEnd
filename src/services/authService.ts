import axios from "axios";
import backendUrl from "../config/backendUrl";

interface Credentials {
    username: string;
    password: string;
}

type Token = string | null;

let token: Token = null;

const setToken = (newToken: string) => {
    token = newToken;
};

export const setConfig = () => {
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
}

const login = async (creadentials: Credentials) => {
    const response = await axios.post(`${backendUrl}/login`, creadentials);
    return response.data;
}

const signup = async (creadentials: Credentials) => {
    const response = await axios.post(`${backendUrl}/signup`, creadentials);
    return response.data;
}

const authService = {login, signup, setToken};

export default authService;