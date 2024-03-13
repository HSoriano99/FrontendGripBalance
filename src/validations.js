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
        return "confirmed new password"
    }
    
}