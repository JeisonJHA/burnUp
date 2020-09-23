import axios from 'axios';

const api = axios.create({
    baseURL: "https://burnup-server.herokuapp.com/"
})

export default api