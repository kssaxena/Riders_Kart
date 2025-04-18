import { Router } from "express";
import {
  RegisterUser,
  Login,
  LogOutUser,
  regenerateRefreshToken,
  GetUserDetails,
  RequestForAPIKey,
  GetMyAllAPIKeys,
  DeactivateMyAPIKey,
} from "../controllers/user.controller.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";
import { GetPaymentHistory } from "../controllers/payment.controller.js";

const router = Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(Login);
router.route("/refresh-tokens").post(regenerateRefreshToken);

router.route("/get-user-details/:userId").get(GetUserDetails);

//secured routes
router.route("/logout").post(VerifyUser, LogOutUser);
router.route("/user/get-user-details/:userId").get(GetUserDetails);

//payment routes
router
  .route("/paymentTransaction/:transactionId/:userId")
  .get(GetPaymentHistory);

router
  .route("/api-key/:apiKeyId")
  .get(VerifyUser, GetMyAllAPIKeys)
  .post(VerifyUser, RequestForAPIKey)
  .delete(VerifyUser, DeactivateMyAPIKey);

export default router;
