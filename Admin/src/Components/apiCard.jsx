import React from "react";
import ButtonWrapper from "./Buttons";
import { truncateString } from "../Utils/Utility-functions";
import { FetchData } from "../Utils/fetchFromAPI";
import { alertError, alertInfo, alertSuccess } from "../Utils/Alert";

const ApiKeyCard = ({ apiKey }) => {
  // console.log(apiKey);

  const handleButtonClick = async (e, action) => {
    e.preventDefault();

    if (["Accept", "Reject", "Deactivate"].includes(action)) {
      let method = "";
      if (action === "Accept") method = "post";
      else if (action === "Reject") method = "patch";
      else if (action === "Deactivate") method = "delete";

      try {
        const response = await FetchData(
          `admin/api-key/activity/${apiKey.key}`,
          method,
          { key: "none" }
        );
        console.log("Response:", response);
        alertSuccess("API Key status updated successfully");
      } catch (error) {
        console.error("Error:", error);
        alertError("Failed to update API Key status");
      }
    } else if (action === "Delete") {
      try {
        const response = await FetchData(
          `admin/api-key/delete/${apiKey.key}`,
          "delete",
          {}
        );
        console.log("Response:", response);
        alertSuccess("API Key deleted");
      } catch (error) {
        console.error("Error:", error);
        alertError("Failed to delete API Key");
      }
    }
  };

  return (
    <div className="w-[60vw] mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">API Key Info</h2>
        <div className="flex gap-2">
          {apiKey.status === "pending" && (
            <ButtonWrapper onClick={(e) => handleButtonClick(e, "Accept")}>
              Accept
            </ButtonWrapper>
          )}
          {apiKey.status === "pending" && (
            <ButtonWrapper onClick={(e) => handleButtonClick(e, "Reject")}>
              Reject
            </ButtonWrapper>
          )}
          {apiKey.isActive && apiKey.status === "approved" && (
            <ButtonWrapper onClick={(e) => handleButtonClick(e, "Deactivate")}>
              Deactivate
            </ButtonWrapper>
          )}
          {apiKey.status === "rejected" && (
            <ButtonWrapper onClick={(e) => handleButtonClick(e, "Accept")}>
              Activate
            </ButtonWrapper>
          )}
          <ButtonWrapper onClick={(e) => handleButtonClick(e, "Delete")}>
            Delete
          </ButtonWrapper>
        </div>
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-4 place-items-start">
        <div className="mb-2 ">
          <span className="font-semibold text-gray-600">Active:</span>
          <p
            className={`text-gray-800 ${
              apiKey.isActive ? "text-green-500" : "text-red-500"
            }`}
          >
            {apiKey.isActive ? "Active" : "Inactive"}
          </p>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-gray-600">Key:</span>
          <p className="break-words text-gray-800">
            {truncateString(apiKey.key, 20)}
          </p>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-gray-600">User ID:</span>
          <p className="text-gray-800">{apiKey.user}</p>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-gray-600">Created At:</span>
          <p className="text-gray-800">
            {new Date(apiKey.createdAt).toLocaleString()}
          </p>
        </div>

        {apiKey.expiry && (
          <div className="mb-2">
            <span className="font-semibold text-gray-600">Expires At:</span>
            <p className="text-gray-800">{apiKey.expiry}</p>
          </div>
        )}

        <div className="mb-2">
          <span className="font-semibold text-gray-600">Type:</span>
          <p className="text-gray-800 capitalize">{apiKey.type}</p>
        </div>

        <div className="mb-2 col-start-2">
          <span className="font-semibold text-gray-600">Requested:</span>
          <p className="text-gray-800">{apiKey.requested ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyCard;
