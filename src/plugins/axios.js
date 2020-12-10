import axios from 'axios';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const axiosConfig = config;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
    return axiosConfig;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshURL = 'http://localhost:3000/user/token';
    if (error.response.status !== 401 || !error.response.data.message.includes('jwt')) {
      return Promise.reject(error);
    }
    if (error.config.url === refreshURL) return Promise.reject(error);
    try {
      const {
        data: { accessToken },
      } = await axios.post('http://localhost:3000/user/token', {
        token: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('accessToken', accessToken);
      const { config } = error;
      config.headers.Authorization = `Bearer ${accessToken}`;
      const response = await axios(config);
      return Promise.resolve(response);
    } catch {
      return Promise.reject(error);
    }
  },
);
