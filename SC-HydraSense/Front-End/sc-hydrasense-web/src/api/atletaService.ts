import api from "./axiosConfig";

export const listarAtletas = async () => {
    const response = await api.get("/atletas");
    return response.data;
};

export const salvarAtleta = async (atleta: any) => {
    const response = await api.post("/atletas", atleta);
    return response.data;
};

export const deletarAtleta = async (id: number) => {
    await api.delete(`/atletas/${id}`);
};