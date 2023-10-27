import axios from "axios";

const api = axios.create({
    baseURL: 'http://financeiro.hugocursos.com.br/apiFinanceiro/',
    
});

export default api;