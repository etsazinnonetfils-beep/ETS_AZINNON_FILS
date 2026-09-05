import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getMotos = () => api.get("/motos");

export const createMoto = (data) => api.post("/motos", data);

export const updateMoto = (id, data) => api.put(`/motos/${id}`, data);

export const deleteMoto = (id) => api.delete(`/motos/${id}`);