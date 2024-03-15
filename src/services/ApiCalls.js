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

export const getClientProfile = async (token, id, paginationData) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    const {carPage, carLimit, inscPage, inscLimit} = paginationData;
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

    return res;
}

export const updatePassword = async (token, id, data) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.patch(`${API_URL}/api/users/update-password/${id}`, data, config);
    
    return res;
}

export const updateCarSpec = async (token, id, data) => {
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.patch(`${API_URL}/api/carspec/update-carSpec-car/${id}`, data, config);
    
    return res;
}

export const registerNewCar = async (token, id, data) => {
    console.log(data)
    const config = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
    const res = await axios.post(`${API_URL}/api/cars/register-user-car/${id}`, data, config);
    
    return res;
}