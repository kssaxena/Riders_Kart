import React, { useEffect, useState } from "react";
import { FetchData } from "../../utility/fetchFromAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import withLoadingUI from "../../Components/Loading";

const AllOrders = ({ startLoading, stopLoading }) => {
  const [allOrders, setAllOrders] = useState();

  // Functions

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        startLoading();
        const Orders = await FetchData("order/get-all-order", "get");
        //console.log(Orders?.data?.data?.allOrders);
        setAllOrders(Orders?.data?.data?.allOrders);
      } catch (error) {
        console.log(error);
      } finally {
        stopLoading();
      }
    };

    getAllOrders();
  }, []);

  return (
    <div className="pt-10 bg-color-standard h-screen">
      <h1 className="text-center text-4xl font-Fredoka">All Orders</h1>

      {allOrders && allOrders.length > 0 ? (
        allOrders.map((order) => (
          <Link
            to={`/current-order/${order._id}`}
            className="bg-dark-blue w-[80vw] h-20 m-auto my-5 p-2 rounded-xl drop-shadow-xl grid grid-cols-5 hover:scale-[1.02] hover:drop-shadow-2xl transition duration-150 ease-in-out "
            key={order?._id}
          >
            <div className="From flex flex-col justify-center items-center">
              <span className="text-sm text-gray-300">From</span>
              <span className=" text-xl font-serif">{order?.sender.name}</span>
            </div>

            <div className="To flex flex-col justify-center items-center">
              <span className="text-sm text-gray-300">To</span>
              <span className=" text-xl font-serif">
                {order?.receiver.name}
              </span>
            </div>

            <div className="vehicle flex flex-col justify-center items-center">
              <span className="text-sm text-gray-300">Using</span>
              <span className=" text-xl font-serif">{order?.vehicle}</span>
            </div>

            <div className="date flex flex-col justify-center items-center">
              <span className="text-sm text-gray-300">Date</span>
              <span className="  font-serif">Not Specified</span>
            </div>
            <div className="price flex flex-col justify-center items-center">
              <span className="text-sm text-gray-300">Price</span>
              <span className=" font-serif">Not Specified</span>
            </div>
          </Link>
        ))
      ) : (
        <p className="w-full text-center ">No orders found.</p>
      )}
    </div>
  );
};

export default withLoadingUI(AllOrders);
