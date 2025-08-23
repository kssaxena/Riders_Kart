import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { alertError, alertSuccess } from "../../../utility/Alert";
import { useDispatch, useSelector } from "react-redux";
import ButtonWrapper from "../../../Components/Buttons";
import withLoadingUI from "../../../Components/Loading";
import { FetchData } from "../../../utility/fetchFromAPI";
import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import { addAllAppointment } from "../../../utility/Slice/AllAppointmentsSlice";

const socket = io(process.env.DomainUrl);
function AllAppointments({ startLoading, stopLoading }) {
  const [allOrders, setAllOrders] = useState();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const navigateToCurrentOrder = () => {
    navigate(`/current-order/${allOrders?._id}`);
  };
  const user = useSelector((store) => store.UserInfo.user);
  const allAppointments = useSelector(
    (store) => store.AllAppointments.allAppointments
  );
  console.log(allOrders);

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

  // of alert for the driver
  useEffect(() => {
    const CreateAlert = () => {
      if (notifications.length > 0)
        alertSuccess(notifications[notifications?.length - 1]?.title);
    };

    CreateAlert();
  }, [notifications]);

  // for fetching all the appointments
  useEffect(() => {
    const getCurrentAppointment = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `order/get-order-details/${allAppointments}`,
          "get"
        );
        console.log(response);
        setAllOrders(response.data.data);
        // alertSuccess("Here is Your Current appointment");
      } catch (err) {
        alertError(parseErrorMessage(err.response.data));
      } finally {
        stopLoading();
      }
    };

    getCurrentAppointment();
  }, [allAppointments]);
  //  for accepting the appoinment
  const handleAccept = async (appointmentId) => {
    try {
      startLoading();
      // const response = await FetchData(
      //   `order/get-order-details/${appointmentId}`,
      //   "post"
      // );
      // console.log(response);
      console.log(appointmentId);
      navigate(`/drivers-home/${appointmentId}`);
    } catch (err) {
      console.log(err);
      // alertError(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };
  // toggle switch active and inactive
  const ToggleSwitch = () => {
    const [isActive, setIsActive] = useState(user?.[0]?.isActive || false);
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
        // await getLiveLocation()
        //   .then(async (location) => {
        //     console.log("User Location:", location);

        //     setLocationHistory((prevHistory) => ({
        //       ...prevHistory,
        //       ...location,
        //     })); // Append new location
        //     setLocationPermissionGranted(true);
        //     const response = await FetchData(
        //       `driver/toggle-active-driver/${user[0]?._id}`,
        //       "post",
        //       // { coordinates: [location.longitude, location.latitude] }
        //       { coordinates: [28.7041, 77.1025] }
        //     )
        //       .then((response) => {
        //         console.log("Location Set successfully:", response);
        //         console.log("Toggle state & locations sent successfully", {
        //           location,
        //         });
        //         setIsActive(!isActive);
        //       })
        //       .catch((error) => console.error("error in fetching:", error));
        //   })
        //   .catch((error) => console.error(error.message));

        const response = await FetchData(
          `driver/toggle-active-driver/${user[0]?._id}`,
          "post",
          // { coordinates: [location.longitude, location.latitude] }
          { coordinates: [77.2224575871163, 28.681199800800137] }
        )
          .then((response) => {
            console.log("Location Set successfully:", response);
            console.log("Toggle state & locations sent successfully", {
              location,
            });
            setIsActive(!isActive);
          })
          .catch((error) => {
            console.error("error in fetching:", error);
            alertError(parseErrorMessage(error.response.data));
          });
      } catch (error) {
        console.error(error);
        // alertError(parseErrorMessage(error.response.data));
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

  return (
    <div className="mt-10 h-screen">
      <ToggleSwitch />
      <div>
        {/* active appointments  */}
        <h1 className="text-center text-4xl ">Active Appointments</h1>
        <div className="flex justify-center items-center w-full p-10">
          {allAppointments && allAppointments.length > 0 ? (
            <div className="flex justify-center items-center w-1/2 bg-neutral-400 rounded-xl p-4">
              <div
                className="w-full flex-col gap-4 flex justify-evenly items-start"
                key={allOrders?._id}
              >
                <div className="From flex justify-center items-center gap-3">
                  <span className="text-sm">From :</span>
                  <span className=" text-xl">{allOrders?.sender?.address}</span>
                </div>

                <div className="To flex justify-center items-center gap-3">
                  <span className="text-sm">To : </span>
                  <span className=" text-xl">
                    {allOrders?.receiver?.address}
                  </span>
                </div>
                <div className="To flex justify-center items-center gap-3">
                  <span className="text-sm">Vehicle Needed : </span>
                  <span className=" text-xl">{allOrders?.vehicle}</span>
                </div>
                <div className="To flex gap-4 justify-center items-center ">
                  <ButtonWrapper
                    children={"Accept"}
                    onClick={() => {
                      handleAccept(allOrders?._id);
                    }}
                  />
                  <ButtonWrapper children={"Reject"} />
                </div>
              </div>
            </div>
          ) : (
            <p>No Appointment found.</p>
          )}
        </div>
      </div>
      <div>
        {/* completed appointments  */}
        <h1 className="text-center text-4xl ">Previous Appointments</h1>
        <div className="flex justify-center items-center w-full p-10">
          {allAppointments && allAppointments.length > 0 ? (
            <div className="flex justify-center items-center w-1/2 bg-neutral-400 rounded-xl p-4">
              <div
                className="w-full flex-col gap-4 flex justify-evenly items-start"
                key={allOrders?._id}
              >
                <div className="From flex justify-center items-center gap-3">
                  <span className="text-sm">From :</span>
                  <span className=" text-xl">{allOrders?.sender?.address}</span>
                </div>

                <div className="To flex justify-center items-center gap-3">
                  <span className="text-sm">To : </span>
                  <span className=" text-xl">
                    {allOrders?.receiver?.address}
                  </span>
                </div>
                <div className="To flex justify-center items-center gap-3">
                  <span className="text-sm">Vehicle Needed : </span>
                  <span className=" text-xl">{allOrders?.vehicle}</span>
                </div>
                <div className="To flex gap-4 justify-center items-center ">
                  {/* <ButtonWrapper children={"Accept"} /> */}
                  <ButtonWrapper
                    children={"View"}
                    onClick={navigateToCurrentOrder}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p>No Appointment found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default withLoadingUI(AllAppointments);
