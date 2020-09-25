import axios from 'axios';

const api = axios.create({
    baseURL: "http://burnup-server.herokuapp.com/"
})

export default api