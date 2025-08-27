import React, { useRef, useState } from "react";
import { User, Truck, Star, IndianRupee } from "lucide-react";
import ButtonWrapper from "../../../Components/Buttons";
import Input from "../../../Components/Input";
import Card from "../../../Components/Card";
import Badge from "../../../Components/Badge";
import ProgressBar from "../../../Components/progressBar";
import Table from "../../../Components/Table";
import withLoadingUI from "../../../Components/Loading";
import { useSelector } from "react-redux";
import { FetchData } from "../../../utility/fetchFromAPI";
import { alertError, alertSuccess } from "../../../utility/Alert";
import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../utility/FormatDateTime";

function DeliveryPartnerProfile({ startLoading, stopLoading }) {
  const [activeTab, setActiveTab] = useState("orders");
  const user = useSelector((store) => store.UserInfo.user);
  const [AllOrder, setAllOrders] = useState([]);
  const driver = user?.[0];
  const [activeRechargePopUp, setActiveRechargePopUp] = useState(false);
  const formRef = useRef();

  const partnerData = {
    walletAmount: driver?.wallet,
    name: driver?.name,
    phone: driver?.number,
    address: driver?.address,
    verificationStatus: driver?.verificationStatus,
    physicallyDisabled: driver?.physicallyDisabled ? "Yes" : "No",
    isActive: driver?.isActive,
    isAvailable: driver?.isAvailable,
    rating: driver?.rating || 0,
    totalDeliveries: driver?.allAppointments?.length,
    totalEarnings: 5000,
    aadhar: driver?.aadhar,
    pan: driver?.pan,
    license: driver?.drivingLicense,
    vehicle: driver?.vehicleDetails,
    insurance: driver?.vehicleDetails?.insurance,
  };

  // Dummy data for now (replace with API integration later)
  useEffect(() => {
    const getCurrentAppointment = async () => {
      try {
        startLoading();
        const response = await FetchData(
          "order/get-appointments-details",
          "post", // use POST
          { orderIds: driver?.allAppointments } // send directly
        );
        console.log(response);
        setAllOrders(response.data.data);
        alertSuccess("Order history fetched successfully !");
      } catch (err) {
        alertError(parseErrorMessage(err.response.data));
      } finally {
        stopLoading();
      }
    };

    getCurrentAppointment();
  }, [driver]);

  const payments = [
    { id: "PAY001", date: "2023-05-02", amount: 71.25 },
    { id: "PAY002", date: "2023-05-04", amount: 30.0 },
  ];

  const handleRecharge = async () => {
    try {
      startLoading();
      const formData = new FormData(formRef.current);
      const response = await FetchData(
        `driver/add-money/${driver._id}`,
        "post",
        formData
      );
      console.log(response);
      alertSuccess("Updates Successfully !");
    } catch (err) {
      console.log(err.response);
      // alertError(parseErrorMessage(err.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="min-h-screen bg-secondry py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-xl mb-6 w-full flex phone:flex-col laptop:flex-row justify-evenly items-center">
          <h1 className="truncate">Partner Profile</h1>
          <div className="w-fit flex justify-center items-center flex-col laptop:flex-col-reverse">
            <ButtonWrapper
              children={`Recharge Wallet`}
              className={`text-base`}
              onClick={() => setActiveRechargePopUp(true)}
            />
            <h1 className="flex justify-center items-center gap-2">
              Current Wallet Balance:{" "}
              <span className="bg-[#DF3F33] px-2 py-1 rounded-2xl w-fit text-white flex justify-center items-center">
                <IndianRupee /> {partnerData?.walletAmount}
              </span>
            </h1>
          </div>
        </div>

        {/* Personal Info */}
        <Card title="Personal Information" className="mb-6">
          <div className="flex items-center mb-3">
            <User className="w-10 h-10 mr-3" />
            <div>
              <div className="flex gap-2 items-center">
                <p className="text-lg font-semibold heading-text-gray">
                  {partnerData.name}
                </p>
                <Badge>{partnerData.verificationStatus}</Badge>
              </div>
              <p className="text-sm subtitle-text-gray">
                Phone: {partnerData.phone}
              </p>
            </div>
          </div>
          <p className="text-sm mb-1">
            <span className="font-semibold">Address:</span>{" "}
            {partnerData.address}
          </p>
          <p className="text-sm mb-1">
            <span className="font-semibold">Physically Disabled:</span>{" "}
            {partnerData.physicallyDisabled}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            {partnerData.isActive ? "Active" : "Inactive"} |{" "}
            {partnerData.isAvailable ? "Available" : "Unavailable"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <h3 className="font-semibold">Aadhar</h3>
              <p className="text-sm">{partnerData.aadhar?.number}</p>
              <img
                src={partnerData.aadhar?.image}
                alt="Aadhar"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">PAN</h3>
              <p className="text-sm">{partnerData.pan?.number}</p>
              <img
                src={partnerData.pan?.image}
                alt="PAN"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">Driving License</h3>
              <p className="text-sm">{partnerData.license?.number}</p>
              <img
                src={partnerData.license?.image}
                alt="DL"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
          </div>
        </Card>

        {/* Vehicle */}
        <Card title="Vehicle Details" className="mb-6">
          <div className="flex items-center mb-3">
            <Truck className="w-10 h-10 mr-3" />
            <div>
              <p className="text-lg font-semibold heading-text-gray">
                {partnerData.vehicle?.vehicleType} -{" "}
                {partnerData.vehicle?.vehicleDescription}
              </p>
              <p className="text-sm subtitle-text-gray">
                Plate: {partnerData.vehicle?.plateNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-semibold">Front</h3>
              <img
                src={partnerData.vehicle?.front}
                alt="Vehicle Front"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">Back</h3>
              <img
                src={partnerData.vehicle?.back}
                alt="Vehicle Back"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">Pollution</h3>
              <img
                src={partnerData.vehicle?.pollution}
                alt="Pollution"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">Insurance</h3>
              <p className="text-sm">No: {partnerData.insurance?.number}</p>
              <p className="text-xs">
                Exp: {new Date(partnerData.insurance?.expiry).toDateString()}
              </p>
              <img
                src={partnerData.insurance?.image}
                alt="Insurance"
                className="mt-1 w-28 h-16 object-cover rounded"
              />
            </div>
          </div>
        </Card>

        {/* Performance */}
        <Card title="Performance Metrics" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
            <div>
              <div className="flex items-center mb-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-base font-semibold">
                  {partnerData.rating}/5
                </span>
              </div>
              <ProgressBar progress={partnerData.rating * 20} />
            </div>
            <div>
              <p className="text-lg font-semibold">
                {partnerData.totalDeliveries}
              </p>
              <p className="text-xs text-gray-600">Total Deliveries</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                ${partnerData.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">Total Earnings</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              {["orders", "payments"].map((tab) => (
                <button
                  key={tab}
                  className={`${
                    activeTab === tab
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } py-2 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders */}
        {activeTab === "orders" && (
          <Card title="Order History">
            <Table headers={["Order ID", "Date (DDMMYY)", "Status", "Action"]}>
              {AllOrder.map((order) => (
                <tr key={order?._id}>
                  <td className="px-4 py-2 text-sm">{order?._id}</td>
                  <td className="px-4 py-2 text-sm">
                    {formatDateTime(order?.createdAt)}
                  </td>
                  <td className="px-4 py-2 text-sm uppercase">
                    {order?.status}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <Link
                      to={`/current-order/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        )}

        {/* Payments */}
        {activeTab === "payments" && (
          <Card title="Payment History">
            <Table headers={["Payment ID", "Date", "Amount"]}>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-4 py-2 text-sm">{payment.id}</td>
                  <td className="px-4 py-2 text-sm">{payment.date}</td>
                  <td className="px-4 py-2 text-sm">
                    ${payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        )}
      </div>
      {activeRechargePopUp && (
        <div className="fixed w-full h-screen top-0 left-0 bg-white flex justify-center items-center flex-col gap-5">
          <h1>Recharge with your desired amount</h1>
          <form
            onSubmit={handleRecharge}
            ref={formRef}
            className="flex flex-col justify-center items-center gap-2"
          >
            <Input name={"rechargeAmount"} placeholder={`Enter you amount`} />
            <div className="w-full flex justify-evenly items-center ">
              <ButtonWrapper children={`Confirm`} type="submit" />
              <ButtonWrapper
                children={`Cancel`}
                onClick={() => setActiveRechargePopUp(false)}
              />
            </div>
          </form>
          <h1>
            On Accepting any order 10 rupee will be deducted from your wallet.
          </h1>
          <h1>Minimum Recharge should be at-least 200 rupee</h1>
          <h1>Minimum Balance should be at-least 20 rupee</h1>
        </div>
      )}
    </div>
  );
}

export default withLoadingUI(DeliveryPartnerProfile);
