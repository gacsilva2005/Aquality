import axios from "axios";
import { globalToast } from "../context/ToastContext";

const api = axios.create({
    baseURL: "http://127.0.0.1:8080",
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            globalToast.error("Sem Conexão", "Não foi possível conectar ao servidor.");
        } else {
            const status = error.response.status;
            if (status >= 500) {
                globalToast.error("Erro no Servidor", "Ocorreu um erro interno. Tente novamente mais tarde.");
            }
        }
        return Promise.reject(error);
    }
);

export default api;