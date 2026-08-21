import { api } from "./client";

export const submitQuestion = (payload) => api.post("/questions", payload).then((r) => r.data);

export const fetchMyQuestions = () => api.get("/questions/my").then((r) => r.data);

export const fetchAllQuestions = () => api.get("/questions").then((r) => r.data);

export const updateQuestion = (id, payload) => api.put(`/questions/${id}`, payload).then((r) => r.data);
