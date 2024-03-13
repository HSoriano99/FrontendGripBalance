import { Navigate, Route, Routes } from "react-router-dom"
import { Home } from "../Home/Home"
import { Profile } from "../Profile/Profile"
import { UserGarage } from "../UserGarage/UserGarage"


export const Body = () =>{

    return (
        <>
            <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/garage" element={<UserGarage />} />
            </Routes>
        </>
    )
}