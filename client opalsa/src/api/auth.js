// src/api/requests.js
import axios from './axios';

export const registerRequest = (user) => axios.post(`/register`, user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifyTokenRequest = (token) => {
    return axios.get('/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };
export const updateUserRequest = (id, user) => axios.put(`/users/${id}`, user);
