import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClientProfile, updateUser } from "../../services/ApiCalls";
import { userData } from "../userSlice";
import Card from "react-bootstrap/Card";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import "./Profile.css";
import { Button } from "react-bootstrap";

export const Profile = () => {
  const navigate = useNavigate();
  const userRdxData = useSelector(userData);
  const dispatch = useDispatch();

  const token = userRdxData.credentials?.token;
  const id = userRdxData.credentials.userData?.userId;
  const decoded = userRdxData.credentials?.userData;

  const [profileData, setProfileData] = useState({});
  const [updateUserData, setUpdateUserData] = useState({});
  const [updatePassword, setUpdatePassword] = useState({});
  const [profileEditable, setProfileEditable] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);

  const [carPage, setCarPage] = useState(1);
  const [carLimit, setCarLimit] = useState(1);
  const [carCount, setCarCount] = useState();

  const [inscPage, setInscPage] = useState(1);
  const [inscLimit, setInscLimit] = useState(1);
  const [inscCount, setInscCount] = useState();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getClientProfile(token, id, carPage, carLimit, inscPage, inscLimit).then(
        (res) => {
          console.log(res);
          setProfileData(res);
          setCarCount(res.userCarsCount);
          setInscCount(res.userInscsCount);
        }
      );
    }
  }, []);

  const editHandlerUser = (event) => {
    setErrorShow(false);
    setUpdateShow(false);
    setProfileEditable(!profileEditable);
    setPasswordEditable(false);
  };

  const editHandlerPassword = (event) => {
    setErrorShow(false);
    setUpdateShow(false);
    setProfileEditable(false);
    setPasswordEditable(true);
  };

  const inputHandlerUser = (event) => {
    setUpdateUserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const inputHandlerPassword = (event) => {
    setUpdatePassword((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const buttonHandlerSave = () => {
    try {
      setErrorShow(false);
      setUpdateShow(false);

      if (
        updateUserData.username === "" ||
        updateUserData.email === "" ||
        updateUserData.first_name === "" ||
        updateUserData.last_name === "" ||
        updateUserData.phone_number === ""
      ) {
        const updateUserData = {
          username: profileData.user.username,
          email: profileData.user.email,
          first_name: profileData.user.first_name,
          last_name: profileData.user.last_name,
          phone_number: profileData.user.phone_number,
        };

        updateUser(token, id, updateUserData)
          .then((res) => {
            console.log(res);

            getClientProfile(
              token,
              id,
              carPage,
              carLimit,
              inscPage,
              inscLimit
            ).then((res) => {
              console.log(res);
              setProfileData(res);
              setCarCount(res.userCarsCount);
              setInscCount(res.userInscsCount);
              setProfileEditable(false);
              setUpdateShow(true);
            });
          })
          .catch((err) => {
            setErrorShow(true);
          });
      } else {
        updateUser(token, id, updateUserData)
          .then((res) => {
            console.log(res);

            getClientProfile(
              token,
              id,
              carPage,
              carLimit,
              inscPage,
              inscLimit
            ).then((res) => {
              console.log(res);
              setProfileData(res);
              setCarCount(res.userCarsCount);
              setInscCount(res.userInscsCount);
              setProfileEditable(false);
              setUpdateShow(true);
            });
          })
          .catch((err) => {
            setErrorShow(true);
          });
      }
    } catch (error) {
      setErrorShow(true);
    }
  };

  const buttonHandlerSavePassword = (event) => {
    setUpdatePassword((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    console.log(updatePassword);
  }, [updatePassword]);
  useEffect(() => {
    console.log(profileEditable);
  }, [profileEditable]);

  return (
    <div className="profileData">
      <Card className="profileCard">
        <div className="imageWrapper">
          {profileData.user?.image ? (
            <Card.Img
              className="profileImage"
              variant="top"
              src="https://opb-opb-prod.cdn.arcpublishing.com/resizer/v2/LHS2VCH5EZGKXHDYQ6OT3HTMJM.JPG?auth=6596a33ebdf4227bcc42c452e13f32e9e0cad16e893b6c5b9b5b1e31d5c5bc87&width=767"
            />
          ) : null}
          <Card.Img
            className="profileImage"
            variant="top"
            src="https://opb-opb-prod.cdn.arcpublishing.com/resizer/v2/LHS2VCH5EZGKXHDYQ6OT3HTMJM.JPG?auth=6596a33ebdf4227bcc42c452e13f32e9e0cad16e893b6c5b9b5b1e31d5c5bc87&width=767"
          />
        </div>
        <Card.Body>
          <Card.Title className="profileCardUsername">
            {profileData.user?.username}
          </Card.Title>
          <Card.Text className="profileCardUsername">
            Get ready for your next challenge!
          </Card.Text>
        </Card.Body>
        <Card.Body className="profileButtons">
          <Button className="garageButton" variant="dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              gap="0.5"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-car-front-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z" />
            </svg>
            <p>Garage</p>
          </Button>
          <Button
            className="garageButton"
            variant="dark"
            href="#profileEditForm"
            onClick={() => editHandlerUser()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-pencil-fill"
              viewBox="0 0 16 16"
            >
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
            </svg>
            <p>Profile</p>
          </Button>
          <Button className="garageButton" variant="dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-calendar2-week-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5M8.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 10.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
            </svg>
            <p>Events</p>
          </Button>
        </Card.Body>
        {updateShow === true ? (
          <p className="update">Yes! Updated successfully.</p>
        ) : null}
      </Card>
      <div className="profileDetails">
        {profileEditable === true ? (
          <Card className="profileEditForm" id="profileEditForm">
            <Button variant="primary" onClick={() => editHandlerPassword()}>
              Change your password here!
            </Button>
            <CustomInput
              placeholder={profileData.user?.username || "Username"}
              type={"username"}
              name={"username"}
              handler={inputHandlerUser}
            ></CustomInput>
            <CustomInput
              placeholder={profileData.user?.email || "Email"}
              type={"email"}
              name={"email"}
              handler={inputHandlerUser}
            ></CustomInput>
            <CustomInput
              placeholder={profileData.user?.first_name || "First Name"}
              type={"first_name"}
              name={"first_name"}
              handler={inputHandlerUser}
            ></CustomInput>
            <CustomInput
              placeholder={profileData.user?.last_name || "Last Name"}
              type={"last_name"}
              name={"last_name"}
              handler={inputHandlerUser}
            ></CustomInput>
            <CustomInput
              placeholder={profileData.user?.phone_number || "Phone Number"}
              type={"phone_number"}
              name={"phone_number"}
              handler={inputHandlerUser}
            ></CustomInput>
            {errorShow ? (
              <p className="error">Nope! Nothing to update.</p>
            ) : null}
            <Button variant="success" onClick={() => buttonHandlerSave()}>
              Save
            </Button>
          </Card>
        ) : null}
        {passwordEditable ===true? (
            <Card className="profileEditForm" id="profileEditForm">
              <CustomInput
              placeholder={"Current Password"}
              type={"password"}
              name={"current_password"}
              handler={inputHandlerPassword}
            ></CustomInput>
            <CustomInput
              placeholder={"New Password"}
              type={"password"}
              name={"new_password"}
              handler={inputHandlerPassword}
            ></CustomInput>
            {errorShow ? (
              <p className="error">Nope! Try again!</p>
            ) : null}
            <Button variant="success" onClick={() => buttonHandlerSavePassword()}>
              Save new password
            </Button>
             </Card>
            ): null}
      </div>
    </div>
  );
};
