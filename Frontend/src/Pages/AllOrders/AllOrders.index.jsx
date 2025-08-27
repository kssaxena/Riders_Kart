import React, { useEffect, useState } from "react";
import { FetchData } from "../../utility/fetchFromAPI";
import { Link } from "react-router-dom";
import withLoadingUI from "../../Components/Loading";
import { formatDate, formatDateTime } from "../../utility/FormatDateTime";

const AllOrders = ({ startLoading, stopLoading }) => {
  const [allOrders, setAllOrders] = useState();

  // Functions

  useEffect(() => {
    const getAllOrders = async () => {
      try {
        startLoading();
        const Orders = await FetchData("order/get-all-order", "get");
        setAllOrders(Orders?.data?.data?.allOrders);
      } catch (error) {
        console.log(error);
      } finally {
        stopLoading();
      }
    };

    getAllOrders();
  }, []);
  console.log(allOrders);

  return (
    <div className="laptop:p-10 phone:py-10 laptop:h-screen phone:h-fit justify-start items-center flex flex-col laptop:gap-20 phone:gap-5">
      <h1 className="text-center text-4xl font-Fredoka">All Orders</h1>
      {allOrders && allOrders.length > 0 ? (
        <div className="overflow-x-auto w-full px-2">
          <table className="min-w-full border border-black text-sm sm:text-xs md:text-sm lg:text-base">
            <thead>
              <tr className="bg-gray-300 text-gray-700">
              <th className="border border-black px-2 py-2 sm:px-1 sm:py-1 md:px-3 md:py-2">
                  From
                </th>
                <th className="border border-black px-2 py-2 sm:px-1 sm:py-1 md:px-3 md:py-2">
                  To
                </th>
                <th className="border border-black px-2 py-2 sm:px-1 sm:py-1 md:px-3 md:py-2">
                  Vehicle
                </th>
                <th className="border border-black px-2 py-2 sm:px-1 sm:py-1 md:px-3 md:py-2">
                  Date(DDMMYY)
                </th>
                <th className="border border-black px-2 py-2 sm:px-1 sm:py-1 md:px-3 md:py-2">
                  Status
                </th>
                <th className="border border-black px-2 py-2 sm:px-1 sm:py-1 md:px-3 md:py-2">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => (
                <tr
                  key={order?._id}
                  className="hover:bg-black/10 duration-300 ease-in-out"
                >
                  <td className="border border-black/20 px-2 py-2 text-center">
                    {order?.sender?.name}
                  </td>
                  <td className="border border-black/20 px-2 py-2 text-center">
                    {order?.receiver?.name}
                  </td>
                  <td className="border border-black/20 px-2 py-2 text-center">
                    {order?.vehicle}
                  </td>
                  <td className="border border-black/20 px-2 py-2 text-center">
                    {formatDate(order?.createdAt)}
                  </td>
                  <td className="border border-black/20 px-2 py-2 text-center uppercase">
                    {order?.status}
                  </td>
                  <td className="border border-black/20 px-2 py-2 text-center">
                    <Link
                      to={`/current-order/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="w-full text-center">No orders found.</p>
      )}
    </div>
  );
};

export default withLoadingUI(AllOrders);
