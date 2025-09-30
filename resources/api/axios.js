// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // change to your backend URL
  withCredentials: true, // if you use sanctum or auth cookies
});

export default api;
