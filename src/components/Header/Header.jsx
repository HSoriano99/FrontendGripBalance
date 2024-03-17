import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, userData } from "../../pages/userSlice";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import { clientRegister, userLogin } from "../../services/ApiCalls";
import { jwtDecode } from "jwt-decode";
import { keyValidator } from "../../validations";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [smShow, setSmShow] = useState(false);
  const [error, setError] = useState(null);
  const [modalForm, setModalForm] = useState();
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  //________________________________________________________________
  const userRdxData = useSelector(userData);

  const token = userRdxData.credentials?.token;
  const decoded = userRdxData.credentials?.userData;

  const logMeOut = () => {
    dispatch(logout({ credentials: {} }));
    setTimeout(() => {
      navigate("/");
    });
  };
  //________________________________________________________________

  const formHandler = (e) => {
    const form = e.form;
    setModalForm(form);
    setSmShow(true);
    setError(null);
  };

  const registerHandler = (event) => {
    setError(null);
    setRegisterData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const buttonRegisterHandler = () => {
    //definimos las credenciales para el futuro login con los datos de registro
    const credentials = {
      email: registerData.email,
      password: registerData.password,
    };
    
    if (keyValidator(registerData, Object.keys(registerData)) === null) {
      setError("Please, enter all fields")
    } else if (Object.keys(keyValidator(registerData, Object.keys(registerData))).length < 3){
      setError("Please, all fields are required")
    } else {
        clientRegister(registerData).then(() => {
        //hacemos login con el usuario recien creado cuando tengamos la respuesta de nuestro registro correctamente
        userLogin(credentials)
        .then((token) => {
            const decodedToken = jwtDecode(token);

            const data = {
            token: token,
            userData: decodedToken,
            };
            
            //guardamos al igual que en el login nuestros datos de usuario logeado 
            dispatch(login({ credentials: data }));
            navigate("/profile");
            setSmShow(false);

        }).catch(() => setError("Failed to login after register!"));
    }).catch(() => setError("Username or email are probably in use!"));
  }
}

  const loginHandler = (event) => {
    setCredentials((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const buttonLoginHandler = () => {
    if (keyValidator(credentials, Object.keys(credentials)) === null) {
      setError("Please, enter your email and password")
    } else if (Object.keys(keyValidator(credentials, Object.keys(credentials))).length < 2){
      setError("Please, email and password are required")
    } else {
      userLogin(credentials)
      .then((token) => {

        const decodedToken = jwtDecode(token);

        const data = {
          token: token,
          userData: decodedToken,
        };
        dispatch(login({ credentials: data }));
        navigate("/profile");
        setSmShow(false);
      }).catch(() => setError("Sorry, try again!"));
    }
    
  };

  return (
    <div className="headerDiv">
      <div className="modalDiv">
        <Modal
          size="m"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            {modalForm === "login" ? (
              <Modal.Title id="example-modal-sizes-title-sm">
                Welcome back!
              </Modal.Title>
            ) : null}
            {modalForm === "register" ? (
              <Modal.Title id="example-modal-sizes-title-sm">
                Join us today!
              </Modal.Title>
            ) : null}
          </Modal.Header>
          <Modal.Body>
            {modalForm === "login" ? (
              <div className="LoginForm">
                <CustomInput
                  placeholder={"Email"}
                  type={"email"}
                  name={"email"}
                  handler={loginHandler}
                ></CustomInput>
                <CustomInput
                  placeholder={"Password"}
                  type={"password"}
                  name={"password"}
                  handler={loginHandler}
                ></CustomInput>
                {error !== null ? (
                    <p className="error">{error}</p>
                ): null}
              </div>
            ) : null}
            {modalForm === "register" ? (
              <div className="RegisterForm">
                <CustomInput
                  placeholder={"Username"}
                  type={"username"}
                  name={"username"}
                  handler={registerHandler}
                ></CustomInput>
                <CustomInput
                  placeholder={"Email"}
                  type={"email"}
                  name={"email"}
                  handler={registerHandler}
                ></CustomInput>
                <CustomInput
                  placeholder={"Password"}
                  type={"password"}
                  name={"password"}
                  handler={registerHandler}
                ></CustomInput>
                {error !== null ? (
                    <p className="error">{error}</p>
                ): null}
              </div>
            ) : null}
          </Modal.Body>
          <div className="modalButtons">
            {modalForm === "register" ? (
              <Button variant="success" onClick={() => buttonRegisterHandler()}>
                Create new account
              </Button>
            ) : null}
            {modalForm === "login" ? (
               <Button variant="success" onClick={() => buttonLoginHandler()}>
                Login
             </Button>
            ) : null}
          </div>
        </Modal>
      </div>
      <div className="navbarDiv">
        <Navbar expand="lg" className="bg-body-tertiary" id="navbar">
          <Container>
            <Navbar.Brand href="/">GRIP BALANCE</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/events">Events</Nav.Link>
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  {!token ? (
                    <>
                      <NavDropdown.Item
                        name="login"
                        onClick={(e) =>
                          formHandler({ form: e.target.getAttribute("name") })
                        }
                      >
                        Login
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        name="register"
                        onClick={(e) =>
                          formHandler({ form: e.target.getAttribute("name") })
                        }
                      >
                        Register
                      </NavDropdown.Item>
                    </>
                  ) : decoded.userRoles === "admin" ? (
                    <>
                      <NavDropdown.Item href="profile">
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item href="admin">
                        Administration
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => logMeOut()}>
                        Log out
                      </NavDropdown.Item>
                    </>
                  ) : (
                    <>
                      <NavDropdown.Item href="profile">
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => logMeOut()}>
                        Log out
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};

