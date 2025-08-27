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
import { IndianRupee } from "lucide-react";
import Card from "../../../Components/Card";
import Table from "../../../Components/Table";
import { formatDateTime } from "../../../utility/FormatDateTime";

const socket = io(process.env.DomainUrl);
function AllAppointments({ startLoading, stopLoading }) {
  const [allOrders, setAllOrders] = useState();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const navigateToCurrentOrder = (id) => {
    navigate(`/current-order/${id}`);
  };
  const user = useSelector((store) => store.UserInfo.user);
  const allAppointments = useSelector(
    (store) => store.AllAppointments.allAppointments
  );
  const createdOrders = allOrders?.filter(
    (order) => order?.status === "created"
  );

  // For socket connection
  useEffect(() => {
    if (socket && user) {
      socket.emit("DriversRoom", user[0]?._id);
      socket.on("newOrder", (notification) => {
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
          "order/get-appointments-details",
          "post", // use POST
          { orderIds: allAppointments } // send directly
        );
        // console.log(response);
        setAllOrders(response.data.data);
      } catch (err) {
        alertError(parseErrorMessage(err.response.data));
      } finally {
        stopLoading();
      }
    };

    if (allAppointments?.length > 0) {
      getCurrentAppointment();
    }
  }, [allAppointments]);

  //  for accepting the appointment
  const handleAccept = async (appointmentId) => {
    try {
      startLoading();
      const response = await FetchData(
        `driver/accept-appointment/${appointmentId}/${user[0]?._id}`,
        "post"
      );
      console.log(response);
      navigate(`/drivers-home/${appointmentId}`);
    } catch (err) {
      console.log(err);
      alertError(parseErrorMessage(err.response.data));
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

        // 👇 dow this code is just for testing remove the below one and uncomment the above one

        const response = await FetchData(
          `driver/toggle-active-driver/${user[0]?._id}`,
          "post",
          // { coordinates: [location.longitude, location.latitude] }
          { coordinates: [77.2224575871163, 28.681199800800137] }
        )
          .then((response) => {
            // console.log("Location Set successfully:", response);
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
    <div className="mt-10 h-fit">
      <ToggleSwitch />
      <div>
        <h1 className="flex justify-center items-center gap-2">
          Current Wallet Balance:{" "}
          <span className="bg-[#DF3F33] px-2 py-1 rounded-2xl w-fit text-white flex justify-center items-center">
            <IndianRupee /> {user?.[0]?.wallet}
          </span>
        </h1>
      </div>
      <div>
        {/* active appointments  */}
        <h1 className="text-center text-4xl ">Active Appointments</h1>
        <div className="flex flex-col justify-center items-center w-full laptop:p-10 phone:p-2 gap-2">
          {allAppointments && allAppointments.length > 0 ? (
            createdOrders && createdOrders.length > 0 ? (
              createdOrders.map((order) => (
                <div
                  key={order?._id}
                  className="flex justify-center items-center laptop:w-1/2 phone:w-full bg-neutral-400 rounded-xl p-4"
                >
                  <div className="w-full flex-col gap-4 flex justify-evenly items-start">
                    <div className="From flex justify-center items-center gap-3">
                      <span className="text-sm">From :</span>
                      <span className="text-xl">{order?.sender?.address}</span>
                    </div>

                    <div className="To flex justify-center items-center gap-3">
                      <span className="text-sm">To :</span>
                      <span className="text-xl">
                        {order?.receiver?.address}
                      </span>
                    </div>

                    <div className="To flex justify-center items-center gap-3">
                      <span className="text-sm">Vehicle Needed :</span>
                      <span className="text-xl">{order?.vehicle}</span>
                    </div>

                    <div className="To flex gap-4 justify-center items-center ">
                      <ButtonWrapper
                        children={"Accept"}
                        onClick={() => handleAccept(order?._id)}
                      />
                      <ButtonWrapper children={"Reject"} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No Appointment found.</p>
            )
          ) : (
            <p>No Appointment found.</p>
          )}
        </div>
      </div>
      <div>
        {/* completed appointments  */}
        <h1 className="text-center text-4xl ">Previous Appointments</h1>
        <div className="flex flex-col justify-center items-center w-full laptop:p-10 phone:p-2 gap-2">
          <Card title="Order History" className="w-full">
            <Table headers={["Order ID", "Date (DDMMYY)", "Status", "Action"]}>
              {allOrders?.map((order) => (
                <tr key={order?._id}>
                  <td className="px-4 py-2 text-sm">{order?._id}</td>
                  <td className="px-4 py-2 text-sm">
                    {formatDateTime(order?.createdAt)}
                  </td>
                  <td className="px-4 py-2 text-sm uppercase">
                    {order?.status}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <Link
                      to={`/current-order/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withLoadingUI(AllAppointments);
