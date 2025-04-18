import { Router } from "express";
import {
  AdminLogin,
  DeleteUser,
  GetAllUsers,
  GetUserDetails,
  ToggleBan,
} from "../controllers/user.controller.js";
import { VerifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import {
  GetAllOrders,
  UpdateOrderLocation,
} from "../controllers/Order.controller.js";
import {
  AcceptRequest,
  GetAllVerifiedDrivers,
  GetAllRegistrationRequests,
  GetRegistrationRequests,
  GetVerifiedPartner,
  PartnerBan,
  DeletePartner,
} from "../controllers/driver.controller.js";
import { CreateOffer } from "../controllers/Offer.controller.js";
import {
  activateApiKey,
  createApiKey,
  deactivateApiKey,
  deleteApiKey,
  getAllApiKeys,
  getRequestedAPIs,
  rejectApiKeyRequest,
} from "../controllers/api-key.controller.js";

const router = Router();

// router.use(VerifyAdmin);
//---------------- routes for admin only ----------------//

//-----------------Route for admin Login --------------------------------//
router.route("/login").post(AdminLogin);
router.route("/re-login").post(AdminLogin);

// User's routes
router.route("/user/get-all-users").get(GetAllUsers);
router.route("/user/get-user-details/:userId").get(GetUserDetails);
router.route("/user/delete-users/:userId").delete(DeleteUser);
router.route("/user/toggle-ban/:userId").post(ToggleBan);

// Order's routes
router.route("/order/get-all-order").get(GetAllOrders);
router.route("/order/update-order-location/:orderID").post(UpdateOrderLocation);

// Driver's routes
router
  .route("/driver/get-all-pending-requests")
  .get(GetAllRegistrationRequests);
router
  .route("/driver/get-pending-requests/:verificationId")
  .get(GetRegistrationRequests);
router.route("/driver/get-all-verified-drivers").get(GetAllVerifiedDrivers);
router.route("/driver/get-verified-drivers/:partnerId").get(GetVerifiedPartner);
router.route("/driver/accept-request/:verificationId").post(AcceptRequest);
router.route("/driver/toggle-ban/:partnerId").post(PartnerBan);
router.route("/driver/delete-partner/:partnerId").delete(DeletePartner);

// Offer routes
router.route("/offer/create-new-offer").post(CreateOffer);

// API Key routes
router.route("/api-key/").get(getAllApiKeys).post(createApiKey);
router.route("/api-key/requested").get(getRequestedAPIs);
router
  .route("/api-key/activity/:id")
  .post(activateApiKey)
  .patch(rejectApiKeyRequest)
  .delete(deactivateApiKey);
router.route("/api-key/delete/:id").delete(deleteApiKey);

export default router;
