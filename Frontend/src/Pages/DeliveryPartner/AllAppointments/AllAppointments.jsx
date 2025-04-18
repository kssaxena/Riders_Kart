import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { alertSuccess } from "../../../utility/Alert";
import { useSelector } from "react-redux";

const socket = io(process.env.DomainUrl);
export default function AllAppointments() {
  const [allOrders, setAllOrders] = useState();
  // const [notifications, setNotifications] = useState([]);
  const allAppointments = useSelector(
    (store) => store.AllAppointments.allAppointments
  );

  console.log(allAppointments);

 

  return (
    <div className="mt-10">
      <h1 className="text-center text-4xl font-bold font-serif">All Orders</h1>

      {allAppointments && allAppointments.length > 0 ? (
        allAppointments.map((order) => (
          <Link
            to={`/current-order/${order._id}`}
            className="bg-dark-blue w-[80vw] h-20 m-auto my-5 p-2 rounded-xl drop-shadow-xl grid grid-cols-5                  hover:scale-[1.02] hover:drop-shadow-2xl transition duration-150 ease-in-out "
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
        <p>No orders found.</p>
      )}
    </div>
  );
}
