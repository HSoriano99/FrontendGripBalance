import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClientProfile, registerCarSpec, registerNewCar, updateCarSpec, updatePassword, updateUser} from "../../services/ApiCalls";
import { userData } from "../userSlice";
import Card from "react-bootstrap/Card";
import { CustomInput } from "../../components/CustomInput/CustomInput";
import "./UserGarage.css";
import { Button, CardBody } from "react-bootstrap";
import { keyValidator, validateCarSpecData, validatePasswordData, validateUpdateData } from "../../validations";

export const UserGarage = () => {
  const navigate = useNavigate();
  const userRdxData = useSelector(userData);
  const token = userRdxData.credentials?.token;
  const id = userRdxData.credentials.userData?.userId;

  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState(null);
  const [updateShow, setUpdateShow] = useState(false);
  const [garageEditable, setGarageEditable] = useState(true);
  const [carSpecEditable, setCarSpecEditable] = useState(false);
  const [newCarEditable, setNewCarEditable] = useState(false);
  const [updateCarSpecData, setUpdateCarSpecData] = useState({});
  const [registerCarSpecData, setRegisterCarSpecData] = useState({});
  const [registerNewCarData, setRegisterNewCarData] = useState({});
  const [paginationData, setPaginationData] = useState({
    carPage: 1,
    carLimit: 1,
    inscPage: 1,
    inscLimit: 1,
  });
  const [itemsCount, setItemsCount] = useState({
    carCount: null,
    inscCount: null,
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getClientProfile(token, id, paginationData).then((res) => {
          setProfileData(res);
          // Actualizar paginationData con los valores convertidos
          setPaginationData((prevState) => ({
            ...prevState,
            carPage: Number(res.carPage),
            carLimit: Number(res.carLimit),
            inscPage: Number(res.inscPage),
            inscLimit: Number(res.inscLimit),
          }));
          setItemsCount((prevState) => ({
            ...prevState,
            carCount: res.userCarsCount,
            inscCount: res.userInscsCount
          }));

          navigate("#garageEdit");
          const hash = window.location.hash;
          if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      );
    }
  }, []);

  const garageHandler = () => {
    setGarageEditable(!garageEditable);
    setCarSpecEditable(false);
    setNewCarEditable(false);
    setUpdateShow(false);
    setError(null)
  };

  const carSpecHandler = () => {
    setCarSpecEditable(!carSpecEditable);
    setUpdateShow(false);
    setError(null)
    setRegisterCarSpecData({}),
    setUpdateCarSpecData({})
  };

  const newCarHandler = () => {
    setNewCarEditable(!newCarEditable);
    setGarageEditable(false);
    setCarSpecEditable(false);
    setUpdateShow(false);
    setError(null)
  };

  const inputHandlerCarSpec = (event) => {
    setError(null)
    if (profileData.user?.car[0]?.carSpec === null) {
      setRegisterCarSpecData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    } else if (profileData.user?.car[0]?.carSpec !== null) {
      setUpdateCarSpecData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    }
  };

  const inputHandlerNewCar = (event) => {
    setError(null)
    setRegisterNewCarData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value.toLowerCase(),
    }));
  };

  const prevPageHandler = () => {
    setRegisterCarSpecData({}),
    setUpdateCarSpecData({})
    if (paginationData.carPage <= 1) {
        null
    } else {
        const carPage = paginationData.carPage -1
        getClientProfile(token, id, { ...paginationData, carPage: carPage }).then((res) => {
            setProfileData(res);
            // Actualizar paginationData con los valores convertidos
            setPaginationData((prevState) => ({
            ...prevState,
                carPage: Number(res.carPage),
                carLimit: Number(res.carLimit),
                inscPage: Number(res.inscPage),
                inscLimit: Number(res.inscLimit),
             }));
            setItemsCount((prevState) => ({
                ...prevState,
                carCount: res.userCarsCount,
                inscCount: res.userInscsCount
              }));
          }
        );
    };
  }

  const nextPageHandler = () => {
    setRegisterCarSpecData({}),
    setUpdateCarSpecData({})
    if (paginationData.carLimit * paginationData.carPage >= itemsCount.carCount) {
        null
    } else {
        const carPage = paginationData.carPage +1
        getClientProfile(token, id, { ...paginationData, carPage: carPage }).then((res) => {
            setProfileData(res);
            // Actualizar paginationData con los valores convertidos
            setPaginationData((prevState) => ({
            ...prevState,
                carPage: Number(res.carPage),
                carLimit: Number(res.carLimit),
                inscPage: Number(res.inscPage),
                inscLimit: Number(res.inscLimit),
             }));
            setItemsCount((prevState) => ({
                ...prevState,
                carCount: res.userCarsCount,
                inscCount: res.userInscsCount
            }));
          }
        );
    };
  }

  const buttonHandlerSaveCarSpecs = () => {
    setError(null);

    const carId =  profileData.user?.car[0]?.id
      
      if (validateCarSpecData(updateCarSpecData) === "empty object") {
        setError("Ups! You didn't update anything!");
        return;
      } else if (validateCarSpecData(updateCarSpecData) === "only empty strings") {
        setError("Ups! You didn't update anything!");
        return;
      } else if (keyValidator(updateCarSpecData, Object.keys(updateCarSpecData)) === null) {
        setError("Ups! You finally didn't update anything!");
      } else if (validateCarSpecData(updateCarSpecData) === "some empty strings") {
        const updateData = {
            car_aero: updateCarSpecData.car_aero || profileData.user?.car[0]?.carSpec?.car_aero,
            car_engine: updateCarSpecData.car_engine || profileData.user?.car[0]?.carSpec?.car_engine,
            car_suspension: updateCarSpecData.car_suspension || profileData.user?.car[0]?.carSpec?.car_suspension,
            car_tires: updateCarSpecData.car_tires || profileData.user?.car[0]?.carSpec?.car_tires,
            car_differential: updateCarSpecData.car_differential || profileData.user?.car[0]?.carSpec?.car_differential,
        };
        updateCarSpec(token, carId, updateData).then(() => {
            getClientProfile(token, id, paginationData).then((res) => {
              setProfileData(res);
              setPaginationData((prevState) => ({
                ...prevState,
                    carPage: Number(res.carPage),
                    carLimit: Number(res.carLimit),
                    inscPage: Number(res.inscPage),
                    inscLimit: Number(res.inscLimit),
                 }));
              setItemsCount((prevState) => ({
                    ...prevState,
                    carCount: res.userCarsCount,
                    inscCount: res.userInscsCount
                }));
              setCarSpecEditable(false);
              setUpdateShow(true);
            });
          }).catch(() => {
            setError("Ups! Try again!");
          });
      } else {
        updateCarSpec(token, carId, updateCarSpecData).then(() => {
            getClientProfile(token, id, paginationData).then((res) => {
              setProfileData(res);
              setPaginationData((prevState) => ({
                ...prevState,
                    carPage: Number(res.carPage),
                    carLimit: Number(res.carLimit),
                    inscPage: Number(res.inscPage),
                    inscLimit: Number(res.inscLimit),
                 }));
              setItemsCount((prevState) => ({
                    ...prevState,
                    carCount: res.userCarsCount,
                    inscCount: res.userInscsCount
                }));
              setCarSpecEditable(false);
              setUpdateShow(true);
            });
          }).catch(() => {
            setError("Ups! Try again!");
          });
      }
  };

  const buttonHandlerRegisterCarSpecs = () => {
    setError(null);

    const carId =  profileData.user?.car[0]?.id
      
      if (keyValidator(registerCarSpecData, Object.keys(registerCarSpecData)) === null) {
        setError("Ups! You finally didn't keep anything!");
      } else if (Object.keys(keyValidator(registerCarSpecData, Object.keys(registerCarSpecData))).length < 5) {
        setError("Ups! You need to complete all fields!");
      } else {
        registerCarSpec(token, carId, registerCarSpecData).then(() => {
            getClientProfile(token, id, paginationData).then((res) => {
              setProfileData(res);
              setPaginationData((prevState) => ({
                ...prevState,
                    carPage: Number(res.carPage),
                    carLimit: Number(res.carLimit),
                    inscPage: Number(res.inscPage),
                    inscLimit: Number(res.inscLimit),
                 }));
              setItemsCount((prevState) => ({
                    ...prevState,
                    carCount: res.userCarsCount,
                    inscCount: res.userInscsCount
                }));
              setCarSpecEditable(false);
              setUpdateShow(true);
            });
          }).catch(() => {
            setError("Ups! Try again!");
          });
      }
  };

  const buttonHandlerSaveNewcar = () => {
    setError(null);
    if (keyValidator(registerNewCarData, Object.keys(registerNewCarData)) === null) {
      setError("Ups! You finally didn't keep anything!");
    } else if (Object.keys(keyValidator(registerNewCarData, Object.keys(registerNewCarData))).length < 5) {
      setError("Ups! You need to complete all fields!");
    } else {
    registerNewCar(token, id, registerNewCarData).then(() => {
      getClientProfile(token, id, paginationData).then((res) => {
        setProfileData(res);
        setPaginationData((prevState) => ({
          ...prevState,
              carPage: Number(res.carPage),
              carLimit: Number(res.carLimit),
              inscPage: Number(res.inscPage),
              inscLimit: Number(res.inscLimit),
           }));
        setItemsCount((prevState) => ({
              ...prevState,
              carCount: res.userCarsCount,
              inscCount: res.userInscsCount
          }));
        setNewCarEditable(false);
      });
    }).catch(() => {
      setError("Ups! Try again!");
    });
  }}

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
          Check your cars or add more!
        </Card.Text>
      </Card.Body>
      <Card.Body className="profileButtons">
        <Button className="garageButton" variant="dark" href= "#garageEdit" onClick={() => garageHandler()}>
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
          {garageEditable === false ? (<p>Garage</p>) : <p>Go Back</p>}
        </Button>
        <Button
          className="garageButton"
          variant="dark"
          href="/profile#profileEditForm"
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
    </Card>
    <div className="profileDetails">
        {newCarEditable === true ? (
           <Button className="newCarButton" variant="danger" href="#newCarForm" onClick={() => newCarHandler()}>Maybe Next Season</Button>
        ): <Button className="newCarButton" variant="primary" href="#newCarForm" onClick={() => newCarHandler()}>Add New Car</Button>}
        {newCarEditable === true ? (
                <Card className="carSpecEdit" id="newCarForm">
                    <CustomInput 
                    placeholder={"Brand: Toyota, Nissan, BMW,..."}
                    type={"text"}
                    name={"car_brand"}
                    handler={inputHandlerNewCar}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"Model: Chaser, PS13, E36 "}
                    type={"text"}
                    name={"car_model"}
                    handler={inputHandlerNewCar}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"Spec: Street, Tracktool, Racecar"}
                    type={"text"}
                    name={"car_spec"}
                    handler={inputHandlerNewCar}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"Category: Racing, Drifting, Timeattack"}
                    type={"text"}
                    name={"car_category"}
                    handler={inputHandlerNewCar}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"Link to you car image here..."}
                    type={"text"}
                    name={"car_image"}
                    handler={inputHandlerNewCar}
                    ></CustomInput>
                    {error ? (<p className="error">{error}</p>) : null}
                    {JSON.stringify(registerNewCarData) !== '{}' ? (
                    <Button variant="success" onClick={() => buttonHandlerSaveNewcar()}>Save New Car</Button>
                    ):null}
                </Card>
            ) : null}
        {garageEditable === true ? (
          <Card className="garageEdit" id="garageEdit">
            <div className="pageButtons">
            {paginationData.carPage > 1 ? (
                <Button className="pageButton" variant="secondary" onClick={() => prevPageHandler()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"/>
                </svg>
                </Button>
                ):
                <Button className="pageButtonHide" variant="secondary" onClick={() => prevPageHandler()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
                <path d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"/>
                </svg>
                </Button>
            }
            {paginationData.carLimit * paginationData.carPage < itemsCount.carCount ? (
                 <Button className="pageButton" variant="secondary" onClick={() => nextPageHandler()}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
                 <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
                 </svg>
                 </Button>
            ):
                <Button className="pageButtonHide" variant="secondary" onClick={() => nextPageHandler()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
                <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
                </svg>
                </Button>
            }
            </div>

            <div className="carCard">
            <div className="imageWrapperCar">
            {profileData.user?.car[0]?.car_image ? (
            <Card.Img
                className="profileImage"
                variant="top"
                src={profileData.user?.car[0]?.car_image}
            />
            ) : null}
            </div>
            <div className="carDetails">
            <Card.Title className="garageCardModel">
            {profileData.user?.car[0]?.car_brand?.toUpperCase()} {profileData.user?.car[0]?.car_model?.toUpperCase()}
            </Card.Title>
            <Card.Text className="garageCardModel">
            {profileData.user?.car[0]?.car_spec?.toUpperCase()} {profileData.user?.car[0]?.car_category?.toUpperCase()}
            </Card.Text>
            <CardBody className="carSpec">
            <Button className="carSpecButton" variant="dark" href="#carSpecEditForm" onClick={() => carSpecHandler(profileData.user?.car[0]?.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
            </svg>
            <p className="carSpecButtonTitle">Car Specs</p>
            </Button>
            {updateShow === true ? (
            <p className="update">Yes! Updated successfully.</p>
            ) : null}
            </CardBody>
            </div>
            </div>
            {carSpecEditable === true && profileData.user?.car[0]?.carSpec !== null? (
                <Card className="carSpecEdit" id="carSpecEditForm">
                    <CustomInput 
                    placeholder={ profileData.user?.car[0]?.carSpec?.car_aero.toUpperCase() + " AERO" || "AERO"}
                    type={"text"}
                    name={"car_aero"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={profileData.user?.car[0]?.carSpec?.car_engine.toUpperCase()  + " ENGINE" || "ENGINE"}
                    type={"text"}
                    name={"car_engine"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={profileData.user?.car[0]?.carSpec?.car_suspension.toUpperCase()  + " SUSPENSION" || "SUSPENSION"}
                    type={"text"}
                    name={"car_suspension"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={profileData.user?.car[0]?.carSpec?.car_tires.toUpperCase()  + " TIRES" || "TIRES"}
                    type={"text"}
                    name={"car_tires"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={profileData.user?.car[0]?.carSpec?.car_differential.toUpperCase()  + " DIFFERENTIAL" || "DIFFERENTIAL"}
                    type={"text"}
                    name={"car_differential"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    {error ? (<p className="error">{error}</p>) : null}
                    {JSON.stringify(updateCarSpecData) !== '{}' ? (
                    <Button variant="success" onClick={() => buttonHandlerSaveCarSpecs()}>Update Specs</Button>
                    ):null}
                </Card>
            ) : null}
            {carSpecEditable === true && profileData.user?.car[0]?.carSpec === null? (
                <Card className="carSpecEdit" id="carSpecEditForm">
                    <CustomInput 
                    placeholder={"AERO"}
                    type={"text"}
                    name={"car_aero"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"ENGINE"}
                    type={"text"}
                    name={"car_engine"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"SUSPENSION"}
                    type={"text"}
                    name={"car_suspension"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"TIRES"}
                    type={"text"}
                    name={"car_tires"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    <CustomInput
                    placeholder={"DIFFERENTIAL"}
                    type={"text"}
                    name={"car_differential"}
                    handler={inputHandlerCarSpec}
                    ></CustomInput>
                    {error ? (<p className="error">{error}</p>) : null}
                    {JSON.stringify(registerCarSpecData) !== '{}' ? (
                    <Button variant="success" onClick={() => buttonHandlerRegisterCarSpecs()}>Save Your Specs</Button>
                    ):null}
                </Card>
            ) : null}
          </Card>
        ):null}
    </div>
  </div>
  )
}