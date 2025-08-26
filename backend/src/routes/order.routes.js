import { Router } from "express";
import {
  CreateOrder,
  CancelOrder,
  GetUserAllOrders,
  // UpdateOrder,
  UpdateOrderStatus,
  GetOrderDetails,
  GetAllAppointments,
} from "../controllers/Order.controller.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
// router.use(VerifyUser);

router.route("/create-new-order").post(VerifyUser, CreateOrder);
router.route("/get-all-order").get(VerifyUser, GetUserAllOrders);
router.route("/get-order-details/:orderId").get(GetOrderDetails);
router.route("/get-appointments-details").post(GetAllAppointments);

// Additional routes for updating order status and details
// router.route("/update-order/:orderId").patch(UpdateOrder);
router.route("/update-order-status/:orderId").post(UpdateOrderStatus);

router.route("/cancel-order/:orderId").delete(VerifyUser, CancelOrder);

export default router;
