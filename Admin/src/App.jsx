import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Autenthication/Login";
import Home2 from "./pages/Home/Home.second";
import CurrentOrder from "./pages/Current-Order/CurrentOrder";
import CurrentUser from "./pages/User/CurrentUser";
import PartnerVerification from "./pages/PendingVerification/PartnerVerification";
import VerifiedPartner from "./pages/VerifiedPartner/VerifiedPartner";
import { FetchData } from "./Utils/fetchFromAPI";
import { alertError } from "./Utils/Alert";
import { parseErrorMessage } from "./Utils/ErrorMessageParser";
import { useDispatch } from "react-redux";
import { addUser } from "./Utils/Slice/UserInfoSlice";

const App = () => {
  const Dispatch = useDispatch();

  useEffect(() => {
    async function reLogin() {
      const RefreshToken = localStorage.getItem("RefreshToken");
      if (!RefreshToken) return;

      try {
        const User = await FetchData("user/refresh-tokens", "post", {
          RefreshToken,
          admin: true,
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
          Dispatch(addUser(User.data.data.user));
        }
        return User;
      } catch (error) {
        console.log(error);
        alertError(parseErrorMessage(error));
      }
      return;
    }

    reLogin();
  }, []);

  return (
    <div className="bg-primary">
      <Routes>
        <Route path="/" element={<Login />} />

        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/home/:sec" element={<Home2 />} />
        <Route path="/current-order/:orderId" element={<CurrentOrder />} />
        <Route path="/current-user/:userId" element={<CurrentUser />} />
        <Route
          path="/current-pending-request/:verificationId"
          element={<PartnerVerification />}
        />
        <Route
          path="/current-verified-partner/:partnerId"
          element={<VerifiedPartner />}
        />
      </Routes>
    </div>
  );
};

export default App;
