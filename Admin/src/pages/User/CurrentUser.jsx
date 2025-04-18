import React, { useEffect, useRef, useState } from "react";
import ButtonWrapper from "../../Components/Buttons";
import Card from "../../Components/Card";
import { User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading/Loading.json";
import { FetchData } from "../../Utils/fetchFromAPI";
import { alertSuccess } from "../../Utils/Alert";

const CurrentUser = () => {
  const { userId } = useParams();
  const [CurrentUser, setCurrentUser] = useState(null);
  const [offerFilter, setOfferFilter] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const offerFormRef = useRef(null);
  useEffect(() => {
    async function fetchUserData(userId) {
      const User = await FetchData(
        `admin/user/get-user-details/${userId}`,
        "get"
      );
      console.log(User);
      setCurrentUser(User?.data?.data);
      return User;
    }
    fetchUserData(userId);
  }, [userId]);

  const handleBanUser = async () => {
    try {
      console.log(userId);

      const response = await FetchData(
        `admin/user/toggle-ban/${userId}`,
        "post"
      );
      console.log(response);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      console.log(userId);

      const response = await FetchData(
        `admin/user/delete-users/${userId}`,
        "delete"
      );
      console.log(response);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleCreateOffer = async () => {
    try {
      console.log(userId);
      const response = await FetchData(
        `admin/offer/create-new-offer/${userId}`,
        "post",
        { offer: "offer" }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const offerFormInputs = [
    { title: "offerName", type: "text" },
    { title: "offerDescription", type: "text" },
    { title: "offerPrice", type: "number" },
    { title: "offerPercentage", type: "number" },
    { title: "offerValidity", type: "date" },
  ];

  const handleOfferFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Access the current value of the ref and prepare FormData
      const formData = new FormData(offerFormRef.current);
      const audience = [CurrentUser?._id];
      formData.append("audience", JSON.stringify(audience));

      // Example: Log the form data for testing
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Convert FormData to JSON (if backend supports JSON)
      // This step depends on whether your backend accepts FormData directly.
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Call FetchData with 'post' method and data
      const response = await FetchData(
        "admin/offer/create-new-offer",
        "post",
        data
      );

      // Handle success
      console.log("Form submitted successfully:", response.data);
      alertSuccess("Form submitted successfully");
      setShowOfferForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const filteredOrders =
    offerFilter === "offer"
      ? CurrentUser?.allOrders?.filter(
          (order) =>
            new Date() - new Date(order.createdAt) <= 10 * 24 * 60 * 60 * 1000
        )
      : CurrentUser?.allOrders;

  return !CurrentUser ? (
    <div className="w-screen flex justify-center items-center">
      <Lottie width={50} height={50} animationData={Loading} />
    </div>
  ) : (
    <div className="flex w-full justify-center items-center h-screen">
      <section className="userDetails flex flex-col justify-between h-[80%] p-10">
        <h1 className="flex items-center text-blue-600 font-bold text-xl mb-5 ">
          <User className="mr-2" />
          User Details
          <div className="flex gap-10 justify-center items-center ml-10">
            <ButtonWrapper onClick={handleBanUser}>Ban User</ButtonWrapper>
            <ButtonWrapper onClick={handleDeleteUser}>
              Delete User
            </ButtonWrapper>
            <ButtonWrapper onClick={() => setShowOfferForm(true)}>
              Create Offer
            </ButtonWrapper>
          </div>
        </h1>
        <Card>
          <div>
            <h1>User ID: {CurrentUser?._id}</h1>
            <h2>Account Created At : {CurrentUser?.createdAt}</h2>
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
      <Card
        className={`flex flex-col justify-start items-center h-[80%] overflow-y-scroll `}
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
          <div key={order._id} className="p-4 border-b border-gray-200 w-full">
            <h1 className="font-semibold">Order {index + 1}</h1>
            <Link
              to={`/current-order/${order._id}`}
              className="hover:text-blue-500 hover:underline hover:underline-cyan-500"
            >
              ID: {order._id}
            </Link>
          </div>
        ))}
      </Card>
      {showOfferForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Generate Offer</h2>
            <form ref={offerFormRef} onSubmit={handleOfferFormSubmit}>
              {/* {Object.keys(offerForm).map((key) => (
                  <div key={key} className="mb-4">
                    <label className="block font-medium mb-2" htmlFor={key}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={offerForm[key]}
                      onChange={handleFormChange}
                      className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                  </div>
                ))} */}
              {offerFormInputs.map((field, index) => {
                return (
                  <div key={index} className="mb-4">
                    <label
                      className="block font-medium mb-2"
                      htmlFor={field.title}
                    >
                      {field.title
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <input
                      type={field.type}
                      id={field.title}
                      name={field.title}
                      className="p-2 border border-gray-300 rounded-lg w-full"
                      required
                    />
                  </div>
                );
              })}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowOfferForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  // onClick={handleOfferFormSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentUser;
