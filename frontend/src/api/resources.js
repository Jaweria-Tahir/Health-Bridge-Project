import { api } from "./client";

export const fetchResources = () => api.get("/resources").then((r) => r.data);

export const searchResources = (params) => api.get("/resources/search", { params }).then((r) => r.data);

export const fetchResource = (id) => api.get(`/resources/${id}`).then((r) => r.data);

export const createResource = (payload) => api.post("/resources", payload).then((r) => r.data);

export const updateResource = (id, payload) => api.put(`/resources/${id}`, payload).then((r) => r.data);

export const deleteResource = (id) => api.delete(`/resources/${id}`).then((r) => r.data);

export const analyzeResource = (id) => api.post(`/resources/${id}/analyze`).then((r) => r.data);
