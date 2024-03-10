export const CustomInput = ({placeholder, type, name, handler}) => {

    return (
        <input placeholder={placeholder} type={type} name={name} onChange={(e) => handler(e)}></input>
    )
}