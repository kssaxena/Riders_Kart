import { DeliveryPartner } from "../models/delivery-partner.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { orderStatus, paymentStatus } from "../utils/AllStatus.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../app.js";
import { NotificationStructure } from "../utils/NotificationClass.js";

export const FindNearbyDrivers = async (Coordinates, Radius = 5000) => {
  // Coordinates should be [longitude, latitude]
  console.log("Searching drivers near:", Coordinates);
  console.log("Radius:", Radius);

  try {
    const drivers = await DeliveryPartner.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: Coordinates, // [longitude, latitude]
          },
          $maxDistance: Radius, // 5 km in meters
        },
      },
      isAvailable: true,
    });
    return drivers;
  } catch (error) {
    console.error("Error finding drivers:", error);
    return [];
  }
};

const PushNotification = async (allDrivers, createdOrder) => {
  allDrivers.map(async (driver, index) => {
    driver.allAppointments.push(createdOrder._id);
    await driver.save();
    // Send push notification

    await driver.populate("allAppointments");

    io.to(`${driver.socketId}`).emit(
      "order:new",
      new NotificationStructure(
        "New Order",
        `${createdOrder.sender?.name} has initiated a new order. Want to have a look?`,
        { allAppointments: driver.allAppointments }
      )
    );
  });
};

const CreateOrder = asyncHandler(async (req, res) => {
  // TODO: frontend can't provide Delivery partner's details, Backend will have to set it accordingly
  const { senderData, receiverData, vehicle, productDetailsData } = req.body;

  const sender = JSON.parse(senderData);
  const receiver = JSON.parse(receiverData);
  const productDetails = JSON.parse(productDetailsData);

  console.log(sender, receiver, productDetails);

  // Validate user
  if (!req.user)
    throw new ApiError(
      500,
      "Please check the middleware because it failed in validation"
    );

  if (
    !sender.senderName ||
    !sender.senderEmail ||
    !sender.senderNumber ||
    !sender.senderAddress ||
    !sender.senderHouseNumber
  ) {
    // Validate sender details
    throw new ApiError(401, "Please provide all sender details");
  }
  if (!sender.pickupCoordinates.long || !sender.pickupCoordinates.lat) {
    throw new ApiError(401, "Please select pickup location!");
  }

  // Validate receiver details
  if (
    !receiver.receiverName ||
    !receiver.receiverEmail ||
    !receiver.receiverNumber ||
    !receiver.receiverAddress ||
    !receiver.receiverHouseNumber
  ) {
    throw new ApiError(401, "Please provide all receiver details");
  }
  if (!receiver.dropCoordinates.long || !receiver.dropCoordinates.lat) {
    throw new ApiError(401, "Please provide receiver's drop location");
  }

  // Validate vehicle
  if (!vehicle) {
    throw new ApiError(401, "Please select a vehicle");
  }

  // Validate product details
  if (
    !productDetails.productType ||
    !productDetails.productWeight ||
    !productDetails.length ||
    !productDetails.width ||
    !productDetails.height ||
    !productDetails.productValue
  ) {
    throw new ApiError(401, "Please provide complete product details");
  }

  // Create a new order
  const newOrder = await Order.create({
    user: req.user,
    sender: {
      name: sender.senderName,
      email: sender.senderEmail,
      number: sender.senderNumber,
      pickup: {
        type: "Point",
        coordinates: [
          sender.pickupCoordinates.long,
          sender.pickupCoordinates.lat,
        ],
      },
      houseNo: sender.senderHouseNumber || null,
      address: sender.senderAddress,
    },
    receiver: {
      name: receiver.receiverName,
      email: receiver.receiverEmail,
      number: receiver.receiverNumber,
      drop: {
        // lat: receiver.dropCoordinates.lat,
        // long: receiver.dropCoordinates.long,
        type: "Point",
        coordinates: [
          receiver.dropCoordinates.long,
          receiver.dropCoordinates.lat,
        ],
      },
      houseNo: receiver.receiverHouseNumber || null,
      address: receiver.receiverAddress,
    },
    vehicle,
    productDetails: {
      productType: productDetails.productType,
      productWeight: productDetails.productWeight,
      Dimension: {
        length: productDetails.length,
        width: productDetails.width,
        height: productDetails.height,
      },
      value: productDetails.productValue,
    },
    tracking: {
      current: {
        type: "Point",
        coordinates: [
          sender.pickupCoordinates.long,
          sender.pickupCoordinates.lat,
        ],
      },
    },
    status: orderStatus[0],
    paymentStatus: paymentStatus[0],
  });

  const createdOrder = await Order.findById(newOrder._id);

  if (!createdOrder)
    throw new ApiError(
      500,
      "Failed to create order due to some internal error! Please try again after some time"
    );

  const user = await User.findById(req.user._id);
  user.allOrders.push(createdOrder._id);
  await user.save();

  const allNearByDrivers = await FindNearbyDrivers(
    createdOrder.sender.pickup.coordinates
  );

  console.log(allNearByDrivers);

  PushNotification(allNearByDrivers, createdOrder);

  // Return success response
  return res
    .status(201)
    .json(
      new ApiResponse(201, { order: newOrder }, "Order created successfully")
    );
});

const UpdateOrderLocation = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { location, ofWhom } = req.body;
  // ofWhom = please provide if you want to update the order location of sender or receiver
  // location = provide the new order location

  if (!location) throw new ApiError(401, "Location not found");
  if (!orderId) throw new ApiError(401, "Order id not found");
  if (ofWhom && ofWhom !== "sender" && ofWhom !== "receiver")
    throw new ApiError(401, "ofWhom property is important");

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");

  const nonUpdatableStatuses = [
    "Dispatched",
    "In Progress",
    "Delivered",
    "Cancelled",
  ];

  if (nonUpdatableStatuses.includes(order.status)) {
    throw new ApiError(
      401,
      "You are not allowed to update this order's location"
    );
  }

  if (ofWhom === "sender") {
    order.sender.pickup = {
      lat: location.lat,
      long: location.long,
    };
  } else {
    order.receiver.drop = {
      lat: location.lat,
      long: location.long,
    };
  }
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order location updated"));
});

const UpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  if (!status) throw new ApiError(401, "Status not found");

  if (!orderId) throw new ApiError(401, "Order id not found");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});

const CancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) throw new ApiError(401, "Order id not found");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status: orderStatus[8] },
    { new: true }
  );

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, order, "Order cancelled"));
});

// It will provide all orders of a specified user
const GetUserAllOrders = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("allOrders");

  if (!user) throw new ApiError(404, "User not found");

  res.status(201).json(new ApiResponse(201, user, "All Orders"));
});

const GetAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  if (orders.length === 0) {
    res
      .status(201)
      .json(new ApiResponse(201, "No Orders found", "Got the data"));
  }

  res.status(201).json(new ApiResponse(201, orders, "All Orders"));
});

const GetOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) throw new ApiError(401, "Order id not found");

  const order = await Order.findById(orderId);

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, order, "Order details"));
});

const AcceptOrder = asyncHandler(async (req, res) => {
  const { deliveryPartnerId, orderId } = req.body;

  if (!deliveryPartnerId || !orderId) {
    throw new ApiError(400, "DeliveryPartnerId and OrderId are required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
  if (!deliveryPartner) {
    throw new ApiError(404, "Delivery Partner not found");
  }

  order.deliveryPartner = deliveryPartnerId;
  await order.save();

  if (!deliveryPartner.activeOrder) deliveryPartner.activeOrder = orderId;
  else throw new ApiError(404, "You already engaged in other order");

  if (!deliveryPartner.allOrders.includes(orderId)) {
    deliveryPartner.allOrders.push(orderId);
  }
  await deliveryPartner.save();

  io.emit("orderAccepted", {
    orderId,
    deliveryPartnerId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { order, deliveryPartner },
        "Order accepted successfully"
      )
    );
});

export {
  AcceptOrder,
  CreateOrder,
  UpdateOrderLocation,
  UpdateOrderStatus,
  CancelOrder,
  GetUserAllOrders,
  GetOrderDetails,
  GetAllOrders,
};
