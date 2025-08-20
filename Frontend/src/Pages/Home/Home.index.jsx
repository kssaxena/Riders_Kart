import React, { useEffect, useState } from "react";
import Booking_And_services from "./Booking_And_services";
import FAQs from "./FAQs";
import { useDispatch, useSelector } from "react-redux";
import { addUser, clearUser } from "../../utility/Slice/UserInfoSlice";
import { alertError, alertSuccess } from "../../utility/Alert";
import { parseErrorMessage } from "../../utility/ErrorMessageParser";
import io from "socket.io-client";
import BrowserNotification from "../../Components/BrowserNotification";
import ButtonWrapper from "../../Components/Buttons";
import { useNavigate } from "react-router-dom";
import LoadingUI from "../../Components/Loading";
// import ButtonWrapper from "../../Components/Buttons";

const Home = ({ startLoading, stopLoading }) => {
  const Dispatch = useDispatch();
  const user = useSelector((store) => store.UserInfo.user);
  // const currentUser = user[0];
  // console.log(currentUser);

  const handleNotification = () => {
    BrowserNotification({
      title: "new order",
      body: "You have a new order",
      icon: "/favicon.ico",
      link: "/wallet-page",
    });
  };

  const Navigate = useNavigate();
  const NavigateProfile = () => {
    Navigate("/user-profile", { replace: true });
  };

  // return user ? (
  //   <div>
  //     <Booking_And_services />
  //     <FAQs />
  //   </div>
  // ) : (
  //   <LoadingUI.Standalone />
  // );
  return (
    <div>
      <Booking_And_services />
      <FAQs />
    </div>
  );
};

export default Home;
