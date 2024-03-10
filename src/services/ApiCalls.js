import axios from "axios";

const API_URL = "http://localhost:3000";

export const clientRegister = async (registerData) => {
  const res = await axios.post(`${API_URL}/api/users/registerUser`,registerData);

  return res;
};

export const userLogin = async (credentials) => {
    const res = await axios.post(`${API_URL}/api/users/login`, credentials);
    console.log(res.data);

    return res.data;
};
