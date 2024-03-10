import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({

    // el nombre del pasillo con el que el store identificará este pasillo, 
    // y la información que contiene ese pasillo nada más abrir
    name: "user",
    initialState: {
        credentials: {}
    },

    // los reducers no son más que funciones que reciben el estado actual y la modificación que queremos 
    // hacer sobre él como parámetros (state, action), y devuelve el nuevo estado con la modificación hecha.
    reducers: {
        login: (state, action) => {
            return {
                ...state,
                ...action.payload,
            }
        },

        logout: (state, action) => {
            return {
                ...state,
                ...action.payload,
            }
        },
    }
})

export const { login, logout } = userSlice.actions;

//creamos una función para extraer el nombre del pasillo del store
export const userData = (state) => state.user;
export default userSlice.reducer;