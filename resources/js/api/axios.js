import axios from "axios";

const api = axios.create({
 baseURL: 'https://api.indocharcoalsupply.com',
  withCredentials: true, // 👈 important

});

export default api;