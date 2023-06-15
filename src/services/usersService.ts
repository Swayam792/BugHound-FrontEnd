import axios from 'axios';
import backendUrl from '../config/backendUrl';
import { setConfig } from './authService';

const baseUrl = `${backendUrl}/users`;

const getUsers = async () => {
  const response = await axios.get(baseUrl, setConfig());
  return response.data;
};

const userService = { getUsers };

export default userService;
