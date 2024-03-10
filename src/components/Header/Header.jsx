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
import { logout, userData } from "../../pages/userSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [smShow, setSmShow] = useState(false);
  const [modalForm, setModalForm] = useState();
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
  };

  useEffect(()=>{
    console.log(smShow)
  }, [smShow]);

  useEffect(()=>{
    console.log(modalForm)
  }, [modalForm]);

  return (
    <div className="headerDiv">
      <div className="modalDiv">
        <Modal
          size="sm"
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby="example-modal-sizes-title-sm">
          <Modal.Header closeButton>
            {modalForm === "login" ? (
              <Modal.Title id="example-modal-sizes-title-sm">
                SIGN IN !
              </Modal.Title>
            ) : null}
            {modalForm === "register" ? (
              <Modal.Title id="example-modal-sizes-title-sm">
                REGISTER NOW !
              </Modal.Title>
            ) : null}
          </Modal.Header>
          <Modal.Body>
            Vas a tatuarte más o quieres ver tus citas confirmadas?
          </Modal.Body>
          <div className="modalButtons">
            <Button variant="secondary" href="/profile">
              MIS CITAS
            </Button>
            <Button variant="dark" onClick={() => setSmShow(false)}>
              MÁS TINTA
            </Button>
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
                {/* <Nav.Link href="/">Home</Nav.Link> */}
                <Nav.Link href="/events">Events</Nav.Link>
                <NavDropdown title="Account" id="basic-nav-dropdown">
                  {!token ? (
                    <>
                      <NavDropdown.Item
                        name="login"
                        onClick={(e) => formHandler({ form: e.target.getAttribute("name") })}>Login
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        name="register"
                        onClick={(e) => formHandler({ form: e.target.getAttribute("name") })}>Register
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
