import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:" + process.env.PORT ?? 3333
})

export default api