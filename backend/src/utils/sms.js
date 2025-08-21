import { ApiError } from "./ApiError.js";
import axios from "axios";

export const sendOtpSMS = async (phoneNumber, otp, name) => {
  try {
    const response = await axios.post(process.env.SEND_SMS_ENDPOINT, {
      SenderId: "TAGGTS",
      Is_Unicode: true,
      Is_Flash: true,
      Message: `Dear ${name} Your OTP for Mobile verification is ${otp}.`,
      MobileNumbers: `91${phoneNumber}`,
      ApiKey: process.env.SMS_API_KEY,
      ClientId: process.env.SMS_CLIENT_ID,
    });

    console.log("SMS sent successfully:", response.data);
    const smsId = response.data?.Data[0]?.MessageId;
    if (!smsId) {
      throw new ApiError(500, "SMS sending failed, no SMS ID returned");
    }

    return smsId;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new ApiError(500, "Failed to send SMS");
  }
};

export const isSmsSentSuccessfully = async (smsId) => {
  try {
    const response = await axios.get(
      `${process.env.CHECK_SMS_STATUS_ENDPOINT}?ApiKey=${process.env.SMS_API_KEY}&ClientId=${process.env.SMS_CLIENT_ID}&MessageId=${smsId}`
    );

    console.log("SMS status checked successfully:", response.data);
    if (response.data?.Data?.Status === "DELIVRD") {
      return true;
    } else if (response.data?.Data?.Status === "FAILED") {
      return false;
    }
  } catch (error) {
    console.error("Error checking SMS status:", error);
    throw new ApiError(500, "Failed to check SMS status");
  }
};
