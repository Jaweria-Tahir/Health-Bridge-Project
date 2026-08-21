import { api } from "./client";

export const fetchEducation = () => api.get("/education").then((r) => r.data);

export const searchEducation = (params) => api.get("/education/search", { params }).then((r) => r.data);

export const fetchEducationItem = (id) => api.get(`/education/${id}`).then((r) => r.data);

export const createEducation = (payload) => api.post("/education", payload).then((r) => r.data);

export const updateEducation = (id, payload) => api.put(`/education/${id}`, payload).then((r) => r.data);

export const deleteEducation = (id) => api.delete(`/education/${id}`).then((r) => r.data);
