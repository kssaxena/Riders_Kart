import React, { useEffect } from "react";
import { useState } from "react";
import Card from "../../../../Frontend/src/Components/Card";
import { User, Truck, Star } from "lucide-react";
import Badge from "../../Components/Badge";
import ProgressBar from "../../Components/progressBar";
import Table from "../../Components/Table";
import ButtonWrapper from "../../Components/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utils/fetchFromAPI";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading/Loading.json";
import { alertSuccess } from "../../Utils/Alert";

const VerifiedPartner = () => {
  const [activeTab, setActiveTab] = useState("orders");
  
  const navigate = useNavigate()

  const { partnerId } = useParams();
  const [CurrentPartner, setPartner] = useState(null);

  useEffect(() => {
    async function fetchPartnerData(partnerId) {
      const Partner = await FetchData(
        `admin/driver/get-verified-drivers/${partnerId}`,
        "get"
      );
      // console.log(Partner);
      setPartner(Partner?.data?.data);
      return Partner;
    }
    fetchPartnerData(partnerId);
  }, []);

  const handleBanPartner = async () => {
    try {
      console.log(partnerId);

      const response = await FetchData(
        `admin/driver/toggle-ban/${partnerId}`,
        "post",
        {}
      );
      console.log(response);
    } catch (error) {
      console.error("Error", error);
    }
  };
  const handleDeletePartner = async () => {
    // alertSuccess("Partner successfully deleted")
    try {
      console.log(partnerId);

      const response = await FetchData(
        `admin/driver/delete-partner/${partnerId}`,
        "delete",
        {}
      );
      alertSuccess("Partner successfully deleted")
      // console.log(response);
      navigate("/home/All_Orders");
    } catch (error) {
      console.error("Error", error);
    }
  };

  const orders = [
    { id: "ORD001", date: "2023-05-01", status: "Delivered", amount: 25.5 },
    { id: "ORD002", date: "2023-05-03", status: "Delivered", amount: 30.0 },
    { id: "ORD003", date: "2023-05-05", status: "Delivered", amount: 15.75 },
  ];

  const payments = [
    { id: "PAY001", date: "2023-05-02", amount: 71.25 },
    { id: "PAY002", date: "2023-05-04", amount: 30.0 },
    { id: "PAY003", date: "2023-05-06", amount: 15.75 },
  ];

  const newRequests = [
    {
      id: "REQ001",
      pickup: "456 Elm St",
      dropoff: "789 Oak St",
      distance: "3.2 miles",
      estimatedEarning: 12.5,
    },
    {
      id: "REQ002",
      pickup: "101 Pine St",
      dropoff: "202 Maple Ave",
      distance: "2.8 miles",
      estimatedEarning: 10.75,
    },
  ];

  return !CurrentPartner ? (
    <div className="w-screen  flex justify-center items-center">
      <Lottie width={50} height={50} animationData={Loading} />
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <span className="font-normal">Partner Id: {CurrentPartner?._id}</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
          Delivery Partner Profile{" "}
        </h1>
        <div className="flex gap-5 py-5">
          <ButtonWrapper onClick={handleBanPartner}>Ban Partner</ButtonWrapper>
          <ButtonWrapper onClick={handleDeletePartner}>
            Delete Partner
          </ButtonWrapper>
        </div>
        <div className="grid grid-cols-2  sm:grid-cols-1 gap-8 mb-8">
          <Card title="Personal Information" className="h-full">
            <div className="flex items-center mb-4">
              <User className="w-12 h-12 mr-4" />
              <div>
                <div className="mt-4 flex gap-2 items-center">
                  <p className="text-lg font-semibold text-gray-800">
                    {CurrentPartner?.name}
                  </p>
                  <Badge>{CurrentPartner?.verificationStatus}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {CurrentPartner?.license}
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="font-semibold">Address:</span>{" "}
              {CurrentPartner?.address}
            </p>
          </Card>

          <Card title="Vehicle Details" className="h-full">
            <div className="flex items-center mb-4">
              <Truck className="w-12 h-12  mr-4" />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {CurrentPartner?.vehicleDetails?.vehicleType}
                  {CurrentPartner?.vehicle?.model}
                  <Badge>{CurrentPartner?.verificationStatus}</Badge>
                </p>
                <p className="text-sm text-gray-600">
                  {CurrentPartner?.vehicleDetails?.year}
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="font-semibold">Plate Number:</span>{" "}
              {CurrentPartner?.vehicleDetails?.plateNumber}
            </p>
          </Card>
        </div>

        <Card title="Performance Metrics" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-lg font-semibold text-gray-800">
                  {CurrentPartner?.rating}/5
                </span>
              </div>
              <ProgressBar progress={CurrentPartner?.rating * 20} />
            </div>

            <div className="flex gap-20">
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {CurrentPartner?.totalDeliveries}
                </p>
                <p className="text-sm text-gray-600">Total Deliveries</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {/* ${CurrentPartner?.totalEarnings.toFixed(2)} */}
                </p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["orders", "payments", "requests"].map((tab) => (
                <button
                  key={tab}
                  className={`${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === "orders" && (
          <Card title="Order History">
            <Table headers={["Order ID", "Date", "Status", "Amount"]}>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card title="Payment History">
            <Table headers={["Payment ID", "Date", "Amount"]}>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        )}

        {activeTab === "requests" && (
          <Card title="New Order Requests">
            <Table
              headers={[
                "Request ID",
                "Pickup",
                "Dropoff",
                "Distance",
                "Est. Earning",
                "Action",
              ]}
            >
              {newRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.pickup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.dropoff}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.distance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${request.estimatedEarning.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ButtonWrapper
                      onClick={() => alert(`Accepted order ${request.id}`)}
                    >
                      Accept
                    </ButtonWrapper>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        )}
      </div>
      <div className="flex gap-5 py-5 px-20">
        <ButtonWrapper onClick={handleBanPartner}>Ban Partner</ButtonWrapper>
        <ButtonWrapper onClick={handleDeletePartner}>
          Delete Partner
        </ButtonWrapper>
      </div>
    </div>
  );
};

export default VerifiedPartner;
