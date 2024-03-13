//VALIDACION DE INPUTS PARA EL UPDATE DE USER

export const validatePasswordData = (data) => {

    console.log(data);

    if ((JSON.stringify(data) === "{}")) {
        console.log("1");
        return "empty fields";
    }
    const {current_password, new_password , confirm_new_password} = data;

    if (!current_password || !new_password || !confirm_new_password) {
        console.log("2");
        return "empty fields";
    }

    if (current_password === "" || new_password === "" || confirm_new_password === "") {
        console.log("3");
        return "empty fields";
    }

    if (new_password !== confirm_new_password) {
        console.log("4");
        return "confirmed incorrectly"
    } else {
        console.log("5");
        return "new password confirmed"
    }
    
}

export const validateUpdateData = (data) => {

    console.log(data);

    if ((JSON.stringify(data) === "{}")) {
        console.log("1");
        return "empty object";
    }
    const {username, email , first_name, last_name, phone_number} = data;

    if (username === "" && email === "" && first_name === "" && last_name === "" && phone_number === "" ) {
        console.log("2");
        return "only empty strings";
    }

    if (username === "" || email === "" || first_name === "" || last_name === "" || phone_number === "" ) {
        console.log("3");
        return "some empty strings";
    }
    
    return "updateData validated"
    
}