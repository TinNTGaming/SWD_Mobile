import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import _ from 'lodash';

const instance = axios.create({
    baseURL: 'http://192.168.1.121:3000',
    // withCredentials: true
});

instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        return response.data;
    }
)

instance.interceptors.request.use(
  (config) => {
    const token = AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
