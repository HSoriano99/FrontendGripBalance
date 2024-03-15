//VALIDACION DE INPUTS PARA EL UPDATE DE USER

export const validatePasswordData = (data) => {

    if ((JSON.stringify(data) === "{}")) {
        
        return "empty fields";
    }
    const {current_password, new_password , confirm_new_password} = data;

    if (!current_password || !new_password || !confirm_new_password) {
        
        return "empty fields";
    }

    if (current_password === "" || new_password === "" || confirm_new_password === "") {
       
        return "empty fields";
    }

    if (new_password !== confirm_new_password) {
       
        return "confirmed incorrectly"
    } else {
        
        return "new password confirmed"
    }
    
}

export const validateUpdateData = (data) => {

    if ((JSON.stringify(data) === "{}")) {
        
        return "empty object";
    }
    const {username, email , first_name, last_name, phone_number} = data;

    if (username === "" && email === "" && first_name === "" && last_name === "" && phone_number === "" ) {
       
        return "only empty strings";
    }

    if (username === "" || email === "" || first_name === "" || last_name === "" || phone_number === "" ) {
        
        return "some empty strings";
    }
    
    return "updateData validated"
    
}

export const validateCarSpecData = (data) => {

    if ((JSON.stringify(data) === "{}")) {
        
        return "empty object";
    }

    const {car_aero, car_engine, car_suspension, car_tires, car_differential} = data;

    if (car_aero === "" && car_engine === "" && car_suspension === "" && car_tires === "" && car_differential === "") {
       
        return "only empty strings";
    }

    if (car_aero === "" || car_engine === "" || car_suspension === "" || car_tires === "" || car_differential === "") {
       
        return "some empty strings";
    }

    return "carSpecData validated"

}

export const keyValidator = (object, keysArray) => {
    const validatedObject = {}
    for (const key of keysArray) {
        if (key in object && object[key] !== '' && object[key] !== undefined) {
            validatedObject[key] = object[key]
        }
    }
    return JSON.stringify(validatedObject) === '{}' ? null : validatedObject
}