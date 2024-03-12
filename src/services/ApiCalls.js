import axios from "axios";

const API_URL = "http://localhost:3000";

export const clientRegister = async (registerData) => {
  const res = await axios.post(`${API_URL}/api/users/registerUser`,registerData);

  return res;
};

export const userLogin = async (credentials) => {
    const res = await axios.post(`${API_URL}/api/users/login`, credentials);

    return res.data;
};

export const getClientProfile = async (token, id, carPage, carLimit, inscPage, inscLimit) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.get(`${API_URL}/api/users/get-complete-user/${id}?carPage=${carPage}&carLimit=${carLimit}&inscPage=${inscPage}&inscLimit=${inscLimit}`, config);
   
    return res.data;

};

export const updateUser = async (token, id, data) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.patch(`${API_URL}/api/users/update-user/${id}`, data, config);
    console.log(res);
    return res;
}