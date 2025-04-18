import React, { useEffect, useState } from "react";
import Card from "../../Components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { FetchData } from "../../Utils/fetchFromAPI";
import Lottie from "lottie-react";
import Loading from "../../assets/Loading/Loading.json";
import { Check, IdCard, X } from "lucide-react";
import ButtonWrapper from "../../Components/Buttons";
import { alertSuccess } from "../../Utils/Alert";

const PartnerVerification = () => {
  const { verificationId } = useParams();
  const [CurrentVerification, setCurrentVerification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVerificationData(verificationId) {
      const Verification = await FetchData(
        `admin/driver/get-pending-requests/${verificationId}`,
        "get"
      );
      // console.log(Verification);
      setCurrentVerification(Verification?.data?.data);
      return Verification;
    }
    fetchVerificationData(verificationId);
  }, []);

  // console.log(CurrentVerification);

  const verifyPartner = async () => {
    try {
      console.log(verificationId);
      const response = await FetchData(
        `admin/driver/accept-request/${verificationId}`,
        "post",
        {}
      );
      console.log(response);
      alertSuccess("Partner Verified Successfully");
      navigate("/home/All_Orders");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const rejectPartner = async () => {
    try {
      console.log(verificationId);
      const response = await FetchData(
        `admin/driver/delete-partner/${verificationId}`,
        "delete"
      );
      console.log(response);
      alertSuccess("Partner Rejected Successfully");
      navigate("/home/All_Orders");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return !CurrentVerification ? (
    <div className="w-screen  flex justify-center items-center">
      <Lottie width={50} height={50} animationData={Loading} />
    </div>
  ) : (
    <div className="flex flex-col h-full justify-center items-center w-full gap-5 py-10">
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Partner Verification
      </h1>
      <div className="flex w-[25%] justify-evenly items-center">
        <ButtonWrapper onClick={verifyPartner} className={`flex gap-4`}>
          Verify <Check />
        </ButtonWrapper>
        <ButtonWrapper onClick={rejectPartner} className={`flex gap-4`}>
          Reject <X />
        </ButtonWrapper>
      </div>
      <Card className="w-[75%]">
        <h1 className="text-red-500 text-2xl flex justify-start items-center">
          <IdCard className="mr-2" /> Application Details
        </h1>
        <div className="p-4 rounded-lg ">
          <div className="grid grid-cols-3 gap-4 text-lg">
            <h2 className="font-medium ">Application Date:</h2>
            <span className="col-span-2 text-2xl font-semibold uppercase">
              {CurrentVerification?.createdAt}
            </span>

            <h2 className="font-medium ">Request Id:</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?._id}
            </span>

            <h2 className="font-medium ">Verification Status:</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?.verificationStatus}
            </span>
          </div>
        </div>
      </Card>
      <Card className="w-[75%]">
        <h1 className="text-red-500 text-2xl flex justify-start items-center">
          <IdCard className="mr-2" /> Personal Details
        </h1>
        <div className="p-4 rounded-lg ">
          <div className="grid grid-cols-3 gap-4 text-lg">
            <h2 className="font-medium ">Name:</h2>
            <span className="col-span-2 text-2xl font-semibold uppercase">
              {CurrentVerification?.name}
            </span>

            <h2 className="font-medium ">Contact Number :</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?.number}
            </span>

            <h2 className="font-medium ">Address :</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?.address}
            </span>
          </div>
        </div>
      </Card>
      <Card className="w-[75%]">
        <h1 className="text-red-500 text-2xl flex justify-start items-center">
          <IdCard className="mr-2" /> Driving License Details
        </h1>
        <div className="p-4 rounded-lg ">
          <div className="grid grid-cols-3 gap-4 text-lg">
            <h2 className="font-medium ">Driving License Number :</h2>
            <span className="col-span-2 text-2xl font-semibold uppercase">
              {CurrentVerification?.drivingLicense?.number}
            </span>

            <h2 className="font-medium ">Driving License Picture :</h2>
            <img
              className="h-[250px] w-[900px]"
              src={CurrentVerification?.drivingLicense?.image}
            />
          </div>
        </div>
      </Card>
      <Card className="w-[75%]">
        <h1 className="text-red-500 text-2xl flex justify-start items-center">
          <IdCard className="mr-2" /> Aadhar Card Details
        </h1>
        <div className="p-4 rounded-lg ">
          <div className="grid grid-cols-3 gap-4 text-lg">
            <h2 className="font-medium ">Aadhar Number:</h2>
            <span className="col-span-2 text-2xl font-semibold uppercase">
              {CurrentVerification?.aadhar?.number}
            </span>

            <h2 className="font-medium ">Aadhar Picture :</h2>
            <img
              className="h-[250px] w-[900px]"
              src={CurrentVerification?.aadhar?.image}
            />
          </div>
        </div>
      </Card>
      <Card className="w-[75%]">
        <h1 className="text-red-500 text-2xl flex justify-start items-center">
          <IdCard className="mr-2" />
          Pan Card Details
        </h1>
        <div className="p-4 rounded-lg ">
          <div className="grid grid-cols-3 gap-4 text-lg">
            <h2 className="font-medium ">Pan Card Number :</h2>
            <span className="col-span-2 text-2xl font-semibold uppercase">
              {CurrentVerification?.pan?.number}
            </span>

            <h2 className="font-medium ">Pan Card Picture :</h2>
            <img
              className="h-[250px] w-[900px]"
              src={CurrentVerification?.pan?.image}
            />
          </div>
        </div>
      </Card>
      <Card className="w-[75%]">
        <h1 className="text-red-500 text-2xl flex justify-start items-center">
          <IdCard className="mr-2" /> Vehicle Details
        </h1>
        <div className="p-4 rounded-lg ">
          <div className="grid grid-cols-2 gap-4 text-lg">
            <h2 className="font-medium ">Vehicle RC Number :</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?.vehicleDetails?.plateNumber}
            </span>

            <h2 className="font-medium ">Vehicle Description :</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?.vehicleDetails?.vehicleDescription}
            </span>

            <h2 className="font-medium ">Vehicle Type :</h2>
            <span className="col-span-2 text-2xl font-semibold">
              {CurrentVerification?.vehicleDetails?.vehicleType}
            </span>

            <h2 className="font-medium ">Vehicle Insurance Image :</h2>
            <img
              className="h-[250px] w-[900px]"
              src={CurrentVerification?.vehicleDetails?.insurance}
            />

            <h2 className="font-medium ">Vehicle Pollution Image :</h2>
            <img
              className="h-[250px] w-[900px]"
              src={CurrentVerification?.vehicleDetails?.pollution}
            />
          </div>
        </div>
      </Card>
      <ButtonWrapper className={`flex gap-4`}>
        Verify <Check />
      </ButtonWrapper>
    </div>
  );
};

export default PartnerVerification;
