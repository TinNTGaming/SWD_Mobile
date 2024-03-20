import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import _ from 'lodash';

const instance = axios.create({
  baseURL: 'https://swd-be.onrender.com',
    // withCredentials: true
});

instance.interceptors.response.use(
    (response) => {
        const { data } = response;
        return response.data;
    }
)

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;