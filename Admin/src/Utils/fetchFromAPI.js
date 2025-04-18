import axios from "axios";
import { alertError } from "./Alert";
import { parseErrorMessage } from "./ErrorMessageParser";

export const FetchData = async (url, method, data = null) => {
  const Base_URL = `${process.env.DomainUrl}/api/v1`;
  const AccessToken = localStorage.getItem("AccessToken");

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AccessToken}`,
    },
    withCredentials: true,
  };

  try {
    let response;
    if (method === "get") {
      response = await axios.get(`${Base_URL}/${url}`, options);
    } else if (method === "post") {
      response = await axios.post(`${Base_URL}/${url}`, data, options);
    } else if (method === "patch") {
      response = await axios.patch(`${Base_URL}/${url}`, data, options);
    } else if (method === "delete") {
      response = await axios.delete(`${Base_URL}/${url}`, options);
    } else {
      return "Please enter a valid method";
    }
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    // alertError(parseErrorMessage(error.response?.data));
    throw error;
  }
};
