import React, { useEffect, useRef, useState } from "react";
import ButtonWrapper from "../../Components/Buttons";
import Card from "../../Components/Card";
import { Loader, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading/Loading.json";
import { FetchData } from "../../utility/fetchFromAPI";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "../../utility/FormatDateTime";
import { alertSuccess } from "../../utility/Alert";

const UserProfile = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const Dispatch = useDispatch();
  // console.log(user);

  const { userId } = useParams();
  // console.log(userId);
  const [CurrentUser, setCurrentUser] = useState(null);
  const [offerFilter, setOfferFilter] = useState("");
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    async function fetchUserData(userId) {
      const User = await FetchData(`user/get-user-details/${userId}`, "get");
      // console.log(User);
      setCurrentUser(User?.data?.data);
      return User;
    }

    const fetchAPIKeys = async () => {
      try {
        const response = await FetchData("user/api-key/:apiKeyId", "get");
        // console.log(response);
        setApiKeys(response?.data?.data);
      } catch (error) {
        console.error("Error submitting form:");
      }
    };

    fetchUserData(userId);
    fetchAPIKeys();
  }, [userId]);
  // console.log(apiKeys);

  const handleAPIDelete = async (apiKeyId) => {
    try {
      const response = await FetchData(`user/api-key/${apiKeyId}`, "delete");
      // console.log(response);
      alertSuccess("API key deleted successfully");
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  const filteredOrders =
    offerFilter === "offer"
      ? CurrentUser?.allOrders?.filter(
          (order) =>
            new Date() - new Date(order.createdAt) <= 10 * 24 * 60 * 60 * 1000
        )
      : CurrentUser?.allOrders;

  const Navigate = useNavigate();
  const NavigateWallet = () => {
    Navigate("/wallet-page", { replace: true });
  };

  return !CurrentUser ? (
    <Loader />
  ) : (
    <div className="flex w-full justify-center items-start h-screen gap-10 py-5">
      <section className="userDetails flex flex-col justify-between gap-5 ">
        <h1 className="flex items-center text-blue-600 font-bold text-xl ">
          <User className="mr-2" />
          User Details
        </h1>

        <Card>
          <div>
            <h1>User ID: {CurrentUser?._id}</h1>
            <h2>
              Account Created At : {formatDateTime(CurrentUser?.createdAt)}
            </h2>
          </div>
        </Card>
        <Card>
          <div className="p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-lg">
              <h2 className="font-medium">Name:</h2>
              <span className="col-span-2 text-2xl font-semibold uppercase">
                {CurrentUser?.name}
              </span>

              <h2 className="font-medium">Email:</h2>
              <span className="col-span-2 text-2xl font-semibold">
                {CurrentUser?.email}
              </span>

              <h2 className="font-medium">Phone:</h2>
              <span className="col-span-2 text-2xl font-semibold">
                {CurrentUser?.number}
              </span>
            </div>
          </div>
        </Card>
        <Card>
          <h2>Total Orders: {filteredOrders?.length || 0}</h2>
        </Card>
      </section>
      <section className="flex flex-col gap-5 ">
        <Card
          className={`flex flex-col justify-start items-center overflow-y-scroll h-96`}
        >
          <h1 className="flex flex-col items-center text-blue-600 font-bold text-xl mb-5 ">
            List of all orders
            <span className="text-green-600">
              Total Order: {filteredOrders?.length || 0}
            </span>
            <div className="mt-4">
              <label htmlFor="offerFilter" className="mr-2">
                Filter Orders:
              </label>
              <select
                id="offerFilter"
                value={offerFilter}
                onChange={(e) => setOfferFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Orders</option>
                <option value="offer">Offers (Orders within 10 days)</option>
              </select>
            </div>
          </h1>
          {filteredOrders?.map((order, index) => (
            <div
              key={order._id}
              className="p-4 border-b border-gray-200 w-full"
            >
              <h1 className="font-semibold">Order {index + 1}</h1>
              <Link to={`/current-order/${order._id}`}>ID: {order._id}</Link>
            </div>
          ))}
        </Card>
        <Card>
          <div className="h-56 overflow-y-scroll">
            <h1>All API keys</h1>
            <div className="flex flex-col gap-2">
              {apiKeys?.map((elements) => (
                <div
                  key={elements._id}
                  className="flex justify-between items-center p-2 border-b border-gray-200"
                >
                  <span className="w-20 overflow-hidden">{elements.key}</span>
                  <span className="w-32 overflow-hidden">
                    Type: {elements.type}
                  </span>
                  <span className="w-20 overflow-hidden">
                    {elements.expiresAt}
                  </span>
                  <button
                    onClick={() => {
                      handleAPIDelete(elements._id);
                      // Handle API key deletion here
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>

    // {!CurrentUser ? (
    //     <div className="w-screen flex justify-center items-center">
    //       <Lottie width={50} height={50} animationData={Loading} />
    //     </div>
    //   ) : }
  );
};

export default UserProfile;
