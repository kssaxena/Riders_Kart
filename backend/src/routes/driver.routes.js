import { Router } from "express";
import {
  GetActiveOrder,
  GetDriver,
  LoginDriver,
  RegenerateRefreshToken,
  RegisterDriver,
  Subscribe,
  ToggleActiveDriver,
  ToggleSuspendPartner,
  // UpdateDriverAddress,
} from "../controllers/driver.controller.js";

const router = Router();

router.route("/register").post(RegisterDriver); 
  // body = {
  //   name,
  //   phone,
  //   address,
  //   password,
  //   licenseNumber,
  //   licenseImage,
  //   aadharNumber,
  //   aadharImage,
  //   panNumber,
  //   panImage,
  //   physicallyDisabled,
  //   vehicleType,
  //   vehicleDescription,
  //   plateNumber,
  //   racFrontImage,
  //   racBackImage,
  //   insuranceImage,
  //   insuranceNumber,
  //   insuranceExpiry,
  //   pollutionImage,
  // }
router.route("/login").post(LoginDriver); // body = { phone, password }
router.route("/refresh-token").post(RegenerateRefreshToken); // body = 

router.route("/get-driver-details/:driverId").get(GetDriver);// body = {}

router.route("/active-order/:driverId").get(GetActiveOrder);// body = {}

router.route("/subscribe").post(Subscribe);// body = 

router.route("/toggle-active-driver/:driverId").post(ToggleActiveDriver); // body = {[longitude, latitude]}

router.route("/toggle-suspend-partner/:partnerId").post(ToggleSuspendPartner);// body = {}

// router
//   .route("/update-driver-address/:driverId")
//   .post(UpdateDriverAddress);

export default router;
