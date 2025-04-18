import React, { useEffect, useRef, useState } from "react";
import Header from "./Components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home.index";
import Footer from "./Components/Footer";
import Booking from "./Pages/Booking/Booking.index";
import LogIn from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import DeliveryPartners from "./Pages/DeliveryPartner/Intro/DeliveryPartners";
import RegisterDriver from "./Pages/DeliveryPartner/Authentication/RegisterDriver";
import AllOrders from "./Pages/AllOrders/AllOrders.index";
import DeliveryPartnerHome from "./Pages/DeliveryPartner/Home/DriverHome.index";
import DeliveryPartnerProfile from "./Pages/DeliveryPartner/Profile/Delivery-partner-profile";
import CurrentProduct from "./Pages/DeliveryPartner/CurrentOrder/Current-order";
import PaymentPage from "./Pages/PaymentPage/PaymentPage";
import Wallet from "./Pages/Wallet/Wallet";
import AllAppointments from "./Pages/DeliveryPartner/AllAppointments/AllAppointments";
import UserProfile from "./Pages/UserProfile/UserProfile";
import { FetchData } from "./utility/fetchFromAPI";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "./utility/Slice/UserInfoSlice";
import { addAllAppointment } from "./utility/Slice/AllAppointmentsSlice";
import { parseErrorMessage } from "./utility/ErrorMessageParser";
import { alertError, alertSuccess } from "./utility/Alert";
import socket from "./socket";
import ApiRequests from "./Pages/API_Requests/ApiRequests";

const App = () => {
  const Dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  // Re-logging in after refreshing the page
  useEffect(() => {
    async function reLogin() {
      const RefreshToken = localStorage.getItem("RefreshToken");
      if (!RefreshToken) return;

      const user = localStorage.getItem("user");
      // console.log(user);

      if (user === "personal") {
        // Refresh the access token using refresh token
        try {
          const User = await FetchData("user/refresh-tokens", "post", {
            RefreshToken,
          });

          if (User.data.success) {
            // console.log(User);
            localStorage.clear(); // will clear the all the data from localStorage
            localStorage.setItem(
              "AccessToken",
              User.data.data.tokens.AccessToken
            );
            localStorage.setItem(
              "RefreshToken",
              User.data.data.tokens.RefreshToken
            );
            localStorage.setItem("user", "personal");

            // Storing data inside redux store
            Dispatch(clearUser());
            Dispatch(addUser(User.data.data.user));
            Dispatch(
              addUser({
                driver: false,
                personal: true,
              })
            );
            socket.emit("joinUsersRoom", User.data.data.user._id);
          }
        } catch (error) {
          console.log(error);
          alertError(parseErrorMessage(error));
        }
      } else {
        try {
          const User = await FetchData("driver/refresh-token", "post", {
            RefreshToken,
          });

          if (User.data.success) {
            console.log(User);
            localStorage.clear(); // will clear the all the data from localStorage
            localStorage.setItem(
              "AccessToken",
              User.data.data.tokens.AccessToken
            );
            localStorage.setItem(
              "RefreshToken",
              User.data.data.tokens.RefreshToken
            );
            localStorage.setItem("user", "driver");

            // Storing data inside redux store
            Dispatch(clearUser());
            Dispatch(addUser(User.data.data.user));
            Dispatch(
              addUser({
                driver: true,
                personal: false,
              })
            );
            Dispatch(addAllAppointment(User.data.data.user.allAppointments));
            socket.emit("joinDriversRoom", User.data.data.user._id);
          }
        } catch (error) {
          console.log(error);
          // alertError(parseErrorMessage(error));
        }
      }
    }

    reLogin();
  }, []);

  return (
    <div className="bg-[#D5D5D7] overflow-hidden font-Fredoka">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/all-orders" element={<AllOrders />} />
        <Route path="/delivery-partners" element={<DeliveryPartners />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/drivers-home" element={<DeliveryPartnerHome />} />

        <Route path="/user-profile/:userId" element={<UserProfile />} />

        <Route path="/current-order/:orderId" element={<CurrentProduct />} />
        <Route
          path="/delivery-partner-profile/:id"
          element={<DeliveryPartnerProfile />}
        />
        <Route path="/all-appointments" element={<AllAppointments />} />
        <Route path="/api-requests/:userId" element={<ApiRequests />} />

        {/* {--------------------------------------payment page--------------------------------------} */}
        <Route path="/payment-page" element={<PaymentPage />} />
        <Route path="/wallet-page" element={<Wallet />} />
        {/* {--------------------------------------Also done--------------------------------------} */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
