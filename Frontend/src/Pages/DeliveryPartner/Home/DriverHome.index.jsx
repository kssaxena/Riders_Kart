import { Bell, ChevronDown, User } from "lucide-react";
import ButtonWrapper from "../../../Components/Buttons";
import { allVehicle } from "../../../Constants/homeConstants";
import { DropDownImg } from "../../../Constants/Driver'sConstant";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alertError, alertSuccess } from "../../../utility/Alert";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../../../utility/fetchFromAPI";
import { addUser, clearUser } from "../../../utility/Slice/UserInfoSlice";
import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import io from "socket.io-client";
import { addAllAppointment } from "../../../utility/Slice/AllAppointmentsSlice";

const socket = io(process.env.DomainUrl);
export default function DeliveryPartnerHome() {
  const Navigate = useNavigate();
  const Dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [popup, setPopup] = useState({
    profile: false,
    notification: false,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const user = useSelector((store) => store.UserInfo.user);
  // console.log(user);
  const [CurrentPartner, setPartner] = useState(null);

  const options = [
    "Dispatched",
    "On the way",
    "On Hold",
    "Delivered",
    "Cancelled",
  ];

  const notificationList = [
    { title: "New Order", details: "Order #123456" },
    { title: "Complain at #123456", details: "Order #123456 has a complain" },
    {
      title: "Modifications in #123457",
      details: "Order #123457 wants to delay",
    },
    { title: "New Order", details: "Order #123456" },
    { title: "Complain at #123456", details: "Order #123456 has a complain" },
  ];

  const currentOrderStatus = [
    { status: "Order confirmed", details: "Confirmed at 11:45" },
    {
      status: "Picked up",
      details: "Picked up from Kathitand at 2:30",
    },
    { status: "On the way", details: "Your product is traveling" },
    {
      status: "At Drop address",
      details: "Reached to the nearest address",
    },
    { status: "Dropped", details: "Successfully Dropped at 5:00" },
  ];

  const profileList = [
    { title: "profile", path: "/delivery-partner-profile/123" },
    { title: "log out", path: "/drivers-logout" },
    { title: "log out", path: "/drivers-logout" },
  ];

  // For socket connection
  useEffect(() => {
    if (socket && user) {
      // Join the room with the delivery partner's ID
      // console.log(user);
      socket.emit("DriversRoom", user[0]?._id);

      // Listen for new order notifications
      socket.on("newOrder", (notification) => {
        console.log("New order received:", notification);
        setNotifications(notification);
        Dispatch(addAllAppointment(notification));
      });
    }

    // Cleanup to prevent memory leaks
    return () => {
      socket.off("newOrder");
    };
  }, [user]); // Run this useEffect when 'user' changes

  useEffect(() => {
    const CreateAlert = () => {
      if (notifications.length > 0)
        alertSuccess(notifications[notifications?.length - 1]?.title);
    };

    CreateAlert();
  }, [notifications]);

  // Handle selecting an option
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  // UI component for switching the driver's active state
  const ToggleSwitch = () => {
    const [isActive, setIsActive] = useState(user[0]?.isActive || false);
    const [coordinates, setLocationHistory] = useState({});
    const [locationPermissionGranted, setLocationPermissionGranted] =
      useState(false);

    // Function to fetch live location
    // const getLiveLocation = () => {
    //   return new Promise((resolve, reject) => {
    //     if (!navigator.geolocation) {
    //       reject(new Error("Geolocation is not supported by your browser."));
    //     } else {
    //       navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //           console.log(position);
    //           const { latitude, longitude } = position.coords;
    //           resolve({ latitude, longitude });
    //         },
    //         (error) => {
    //           reject(new Error("Error fetching location: " + error));
    //         },
    //         {
    //           enableHighAccuracy: true,
    //           timeout: 10000,
    //           maximumAge: 0,
    //         }
    //       );
    //     }
    //   });
    // };

    const getLiveLocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser."));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            (error) => {
              let errorMessage = "";
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = "User denied the request for Geolocation.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = "Location information is unavailable.";
                  break;
                case error.TIMEOUT:
                  errorMessage = "The request to get user location timed out.";
                  break;
                case error.UNKNOWN_ERROR:
                default:
                  errorMessage = "An unknown error occurred.";
                  break;
              }
              reject(new Error(`Error fetching location: ${errorMessage}`));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }
      });
    };

    // const sendToggleState = async (locations) => {
    //   if (user?.length > 0) {
    //     try {
    //       const response = await FetchData(
    //         `driver/toggle-active-driver/${user[0]?._id}`,
    //         "post",
    //         { coordinates: locations }
    //       );
    //       console.log(response);
    //       console.log("Toggle state & locations sent successfully", {
    //         locations,
    //       });
    //     } catch (error) {
    //       console.error("Error sending toggle state:", error);
    //     }
    //   }
    // };
    // useEffect(() => {
    //   sendToggleState();
    // }, [user]);

    const handleToggle = async () => {
      try {
        await getLiveLocation()
          .then(async (location) => {
            console.log("User Location:", location);

            setLocationHistory((prevHistory) => ({
              ...prevHistory,
              ...location,
            })); // Append new location
            setLocationPermissionGranted(true);
            const response = await FetchData(
              `driver/toggle-active-driver/${user[0]?._id}`,
              "post",
              { coordinates: [location.longitude, location.latitude] }
            )
              .then((response) => {
                console.log("Location Set successfully:", response);
                console.log("Toggle state & locations sent successfully", {
                  location,
                });
                setIsActive(!isActive);
              })
              .catch((error) => console.error("error in fetching:", error));
          })
          .catch((error) => console.error(error.message));
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className="flex flex-col items-center space-y-2">
        <div
          onClick={handleToggle}
          className={`w-16 h-8 flex items-center cursor-pointer rounded-full p-1 transition-all duration-300 ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
              isActive ? "transform translate-x-8" : ""
            }`}
          ></div>
        </div>

        <span className="font-semibold text-lg">
          {isActive ? "Active" : "Inactive"}
        </span>

        {isActive && Object.keys(coordinates).length > 0 && (
          <div className="text-sm text-gray-700">
            <p>
              Last Location: {Object.keys(coordinates).pop()},{" "}
              {Object.values(coordinates).pop()}
            </p>
          </div>
        )}
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const DropdownMenu = ({ options, onSelect }) => {
    return (
      <div className="dropdown-menu py-2 px-10 flex flex-col border rounded-xl justify-start items-center -m-10">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => onSelect(option)}
            className="px-4 py-2 rounded-2xl bg-button text-white drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out w-full flex justify-center items-center m-2 "
          >
            {option}
          </div>
        ))}
      </div>
    );
  };

  const LocationTracker = () => {
    const [location, setLocation] = useState({
      latitude: null,
      longitude: null,
    });

    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const getLiveLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          updateLocation,
          handleLocationError,
          {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000,
          }
        );
      } else {
        setError("Unable to get location");
      }
    };

    const updateLocation = (position) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(newLocation);
      setError(null);
      sendLocationToBackend(newLocation);
    };

    const handleLocationError = (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        if (retryCount < 3) {
          alert("Please allow location access to proceed.");
          setRetryCount(retryCount + 1);
          setTimeout(getLiveLocation, 3000);
        } else {
          setError("Location permission denied multiple times.");
        }
      } else {
        setError(`Error geting location: ${err.message}`);
      }
    };

    const sendLocationToBackend = async (newLocation) => {
      try {
        const response = await FetchData(
          `update-driver-address/${user?.[0]?.address}`,
          "post",
          {
            body: JSON.stringify(newLocation),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send location .");
        }

        const data = await response.json();
        console.log("Location Taken successfully", data);
      } catch (err) {
        setError(`Error Taking location: ${err.message}`);
      }
    };

    useEffect(() => {
      getLiveLocation();
    }, []);

    return (
      <div className="flex flex-col justify-start items-start px-10">
        <h2 className="text-xl">Live Location</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          Your Current Location: {""}
          {location.latitude && location.longitude
            ? `Lon: ${location.longitude}, Lat: ${location.latitude}`
            : "Fetching location..."}
        </p>
        <ButtonWrapper onClick={getLiveLocation} className="mt-2">
          Retry Location
        </ButtonWrapper>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 ">
      <header className="Name-and-profile-icon  flex justify-between items-center mb-10 relative">
        <div className="mx-10 ">
          <h1 className="text-4xl font-serif ">{CurrentPartner?.name}</h1>
          <p className="text-gray-600 text-sm">{CurrentPartner?.address}</p>
        </div>

        {/* Profile and notification icons */}
        <div className="flex items-center space-x-4 mx-10 ">
          <ToggleSwitch />
          <button
            className="relative "
            onClick={() =>
              setPopup((perv) => {
                return {
                  profile: false,
                  notification: !perv.notification,
                };
              })
            }
            title="notification"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          </button>
          <button
            onClick={() =>
              setPopup((perv) => {
                return {
                  notification: false,
                  profile: !perv.profile,
                };
              })
            }
            title="profile"
          >
            <User className="w-6 h-6" />
          </button>
        </div>

        {/* Profile dropdown */}
        {popup.profile && (
          <div className="Popup  absolute w-36 h-52 right-12 top-10    backdrop-blur-sm z-50">
            <img
              src={DropDownImg}
              alt=""
              className="h-full w-full opacity-80 "
            />
            <div className="text-white w-full h-fit flex flex-col  justify-start items-start gap-2 px-4 py-2 absolute top-5 ">
              {profileList.map((item) => {
                return (
                  <Link
                    to={item.path}
                    className="bg-primary text-black w-full px-1 rounded-lg hover:scale-105 drop-shadow-xl transition duration-150 ease-in-out  "
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* notification dropdown */}
        {popup.notification && (
          <div className="Popup  absolute w-52 h-64 right-24 top-10    backdrop-blur-sm z-50">
            <img src={DropDownImg} alt="" className="h-full w-full  " />
            <div className="text-white w-full h-fit flex flex-col  justify-start items-start gap-2 px-2 py-2 absolute top-5 ">
              {notificationList.map((item) => {
                return (
                  <Link
                    to={"/notifications"}
                    className="bg-primary text-black w-full px-1 rounded-lg hover:scale-105 drop-shadow-xl transition duration-150 ease-in-out  "
                  >
                    <li>{item.title}</li>
                  </Link>
                );
              })}
              <Link
                to={"/notifications"}
                className=" hover:underline transition duration-150 ease-in-out  font-bold "
              >
                Show more
              </Link>
            </div>
          </div>
        )}
      </header>

      <div
        onClick={() => Navigate("/current-order/123")}
        className="Current-parcel  bg-secondary-color text-white mb-6 m-5 p-2 rounded-xl hover:scale-[1.02] drop-shadow-xl hover:drop-shadow-2xl transition duration-150 ease-in-out cursor-pointer"
      >
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className=" font-semibold text-sm mb-1">From</p>
              <h2 className="text-2xl font-bold mb-1 font-serif">Vivek</h2>
              <p className="text-xs ">Ratu, Kathitand, Ranchi, 835222</p>
            </div>
            <div>
              <p className=" font-semibold text-sm mb-1">To</p>
              <h2 className="text-2xl font-bold mb-1 font-serif">Kivi</h2>
              <p className="text-xs ">Tatisilway, Ranchi, 278525</p>
            </div>
            <div className="text-center  h-32">
              <img src={allVehicle[0].icon} className="h-full" alt="" />
              <p className="text-sm">
                Using: {CurrentPartner?.vehicleDetails?.vehicleType}
                {/* Plate Number:  {CurrentPartner?.vehicleDetails?.plateNumber} */}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold">27-10-2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="  rounded-3xl overflow-hidden">
        <div className="p-6 flex flex-col gap-5 justify-center items-center ">
          <h2 className="text-2xl heading-text-gray font-semibold font-serif underline ">
            Current Status
          </h2>

          <div className="space-y-4">
            {currentOrderStatus.map((step, index) => (
              <div
                key={index}
                className="flex items-center justify-start bg-secondary-color rounded-full p-2  hover:drop-shadow-xl transition duration-150 ease-in-out"
              >
                {/* Status */}
                <div className="bg-white subtitle-text-gray  py-2 px-4 rounded-full w-52 text-center mr-4 font-semibold">
                  {step.status}
                </div>

                {/* center line */}
                <div className="flex mx-4 w-[50vw] border hidden laptop:block">
                  <div className="h-0.5 bg-white w-full relative">
                    <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-white" />
                    <div className="absolute -right-1.5 -top-1.5 w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>

                {/* Details */}
                <div className=" text-white font-medium">{step.details}</div>
              </div>
            ))}
          </div>

          <ButtonWrapper
            variant="secondary"
            className="mb-6 flex"
            onClick={toggleDropdown} // Toggle the dropdown when clicked
          >
            Update Details
            <ChevronDown className="hover:rotate-180 duration-500" />
          </ButtonWrapper>

          {isDropdownOpen && (
            <DropdownMenu options={options} onSelect={handleSelectOption} />
          )}

          {selectedOption && <p>Selected Status: {selectedOption}</p>}
        </div>
      </div>
    </div>
  );
}
