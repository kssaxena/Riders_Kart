import { Router } from "express";
// import {
//   GetUserAllOrders,
//   CreateOrder,
//   CancelOrder,
//   GetOrderDetails,
// } from "../controllers/Order.controller.js";
import {
  GetMyOrders,
  CreateOrder,
  CancelOrder,
  GetOrderDetails,
} from "../controllers/public.controller.js";

import apiKeyAuth from "../middlewares/apiKeyAuth.js";
import apiLimiter from "../middlewares/apiRateLimiter.js";
import { VerifyUser } from "../middlewares/auth.middleware.js";

const router = Router();
console.log("reached public routes");
router.use(apiLimiter); // Apply rate limiting middleware to all routes
router.use(apiKeyAuth); // Apply API key authentication middleware to all routes


router.route("/order/").get(GetMyOrders).post(CreateOrder);
router.route("/order/:id").get(GetOrderDetails).delete(CancelOrder);

export default router;
