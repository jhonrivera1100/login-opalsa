import axios from './axios';

export const registerRequest = (user) => axios.post(`/register`, user, { withCredentials: true });
export const loginRequest = (user) => axios.post(`/login`, user, { withCredentials: true });
export const verifyTokenRequest = (token) => axios.get('/verify', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  withCredentials: true
});
export const updateUserRequest = (id, user) => axios.put(`/users/${id}`, user, { withCredentials: true });
export const getUserDataRequest = (userId) => axios.get(`/users/${userId}`, { withCredentials: true });
