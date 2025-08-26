import { Bell, ChevronDown, User } from "lucide-react";
import ButtonWrapper from "../../../Components/Buttons";
import { allVehicle } from "../../../Constants/homeConstants";
import {
  currentOrderStatus,
  DropDownImg,
} from "../../../Constants/Driver'sConstant";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { alertError, alertSuccess } from "../../../utility/Alert";
import { useDispatch, useSelector } from "react-redux";
import { FetchData } from "../../../utility/fetchFromAPI";
import { addUser, clearUser } from "../../../utility/Slice/UserInfoSlice";
import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import io from "socket.io-client";
import { addAllAppointment } from "../../../utility/Slice/AllAppointmentsSlice";
import withLoadingUI from "../../../Components/Loading";
import { formatDateTime } from "../../../utility/FormatDateTime";
import {
  fetchOrderById,
  setSteps,
  updateOrderStatusAsync,
} from "../../../utility/Slice/OrderStatus";

const socket = io(process.env.DomainUrl);
function DeliveryPartnerHome({ startLoading, stopLoading }) {
  const { appointmentId } = useParams();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { steps, loading } = useSelector((store) => store.orderStatus);

  // const currentOrderStatus = [
  //   { status: "On the way for Order Pickup" },
  //   { status: "Order Picked up" },
  //   { status: "On the way" },
  //   { status: "At Drop address" },
  //   { status: "Order Dropped" },
  // ];

  // initialize steps in Redux once
  useEffect(() => {
    if (currentOrderStatus?.length > 0) {
      dispatch(setSteps(currentOrderStatus));
    }
  }, [dispatch]);
  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchOrderById(appointmentId)); // ✅ fetch order and hydrate steps
    }
  }, [appointmentId, dispatch]);
  const user = useSelector((store) => store.UserInfo.user);
  const deliveryPartner = user?.[0];
  const [CurrentPartner, setPartner] = useState(null);
  const [currentOrder, setCurrentOrder] = useState();

  useEffect(() => {
    const getCurrentAppointment = async () => {
      try {
        startLoading();
        const response = await FetchData(
          `order/get-order-details/${appointmentId}`,
          "get"
        );
        console.log(response);
        setCurrentOrder(response.data.data);
        // alertSuccess("Here is Your Current appointment");
      } catch (err) {
        alertError(parseErrorMessage(err.response.data));
      } finally {
        stopLoading();
      }
    };

    getCurrentAppointment();
  }, [appointmentId]);

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

  return !currentOrder ? (
    <withLoadingUI />
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 ">
      <section className="Name-and-profile-icon  flex justify-between items-center mb-10 relative">
        <div className="mx-10 ">
          <h1 className="text-4xl font-serif ">{CurrentPartner?.name}</h1>
          <p className="text-gray-600 text-sm">{CurrentPartner?.address}</p>
        </div>
      </section>

      <div
        // onClick={() => Navigate("/current-order/123")}
        className="Current-parcel bg-neutral-300 mb-6 m-5 p-2 rounded-xl hover:scale-[1.02] drop-shadow-xl hover:drop-shadow-2xl transition duration-150 ease-in-out cursor-pointer"
      >
        <div className="p-6 flex flex-col justify-center items-center">
          <div className="flex phone:flex-col laptop:flex-row phone:gap-3 phone:justify-start laptop:justify-between phone:items-start laptop:items-center w-full">
            <div>
              <p className=" font-semibold text-sm">From</p>
              <h2 className="text-2xl font-bold font-serif">
                {currentOrder?.sender?.name}
              </h2>
              <p className="text-xs ">
                Address: {currentOrder?.sender?.address}
              </p>
            </div>
            <div>
              <p className=" font-semibold text-sm">To</p>
              <h2 className="text-2xl font-bold font-serif">
                {currentOrder?.receiver?.name}
              </h2>
              <p className="text-xs ">
                Address : {currentOrder?.receiver?.address}
              </p>
            </div>
            <div className="text-center flex justify-center items-center flex-col h-32">
              <img src={allVehicle[0].icon} className="h-full" alt="" />
              <p className="text-sm flex justify-center items-center gap-5">
                Using: {deliveryPartner?.vehicleDetails?.vehicleType} {""}
                <span>
                  {" "}
                  Plate Number: {deliveryPartner?.vehicleDetails?.plateNumber}
                </span>
              </p>
            </div>
            <div>
              {/* order creation date  */}
              <p className="text-2xl flex flex-col justify-center items-center">
                Order Created at:{" "}
                <span>{formatDateTime(currentOrder?.createdAt)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden">
        <div className="p-6 flex flex-col gap-5 justify-center items-center ">
          <h2 className="text-2xl">Current Order Status</h2>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-neutral-300 laptop:p-1 phone:p-1 rounded-full phone:text-sm laptop:text-base hover:drop-shadow-xl transition duration-150 ease-in-out w-full"
              >
                {/* Status */}
                <div
                  className={`${
                    step.completed ? "bg-green-500 text-white" : "bg-white"
                  } laptop:py-2 laptop:px-4 phone:px-2 phone:py-1 rounded-full laptop:w-52 phone:w-fit text-center font-semibold`}
                >
                  {step.status}
                </div>

                {/* center line */}
                <div className="flex mx-4 w-[50vw] border hidden laptop:block">
                  <div className="h-0.5 bg-white w-full relative">
                    <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-white" />
                    <div className="absolute -right-1.5 -top-1.5 w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>

                {/* Check Button */}
                <div className="flex items-center gap-3 font-medium">
                  <ButtonWrapper
                    key={index}
                    className={`px-3 py-1 rounded-full border transition ${
                      step.completed
                        ? "bg-green-600 text-white cursor-not-allowed"
                        : "hover:bg-green-500 hover:text-white"
                    }`}
                    children={step.completed ? "✔" : "Confirm"}
                    onClick={() =>
                      dispatch(
                        updateOrderStatusAsync({
                          appointmentId,
                          status: step.status,
                        })
                      )
                    }
                    disabled={step.completed || loading} // disable while updating
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withLoadingUI(DeliveryPartnerHome);
