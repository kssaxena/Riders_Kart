import orderSocket from "../socket/order.socket.js";
import userSocket from "../socket/user.socket.js";
import driverSocket from "../socket/driver.socket.js";
import { DeliveryPartner } from "../models/delivery-partner.model.js";
import { User } from "../models/user.model.js";

export default (io) => {
  io.on("connection", (socket) => {

    // Join Drivers Room
    socket.on("joinDriversRoom", async (driverId) => {
      if (driverId) {
        socket.join("DriversRoom");
        await DeliveryPartner.findByIdAndUpdate(driverId, {
          socketId: socket.id,
        });
        console.log(`Driver ${driverId} joined DriversRoom`);
      }
    });

    // Join Users Room
    socket.on("joinUsersRoom", async (userId) => {
      if (userId) {
        socket.join("UsersRoom");
        await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
        });
        console.log(`User ${userId} joined UsersRoom`);
      }
    });

    orderSocket(io, socket);
    userSocket(io, socket);
    driverSocket(io, socket);

    // **Handle Disconnect**
    socket.on("disconnect", async () => {
      try {
        // Check if the disconnected user is a Delivery Partner
        const deliveryPartner = await DeliveryPartner.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null }
        );

        console.log(deliveryPartner);
        if (deliveryPartner) {
          console.log(`Delivery Partner ${deliveryPartner._id} disconnected.`);
          return;
        }

        // If not found in DeliveryPartner, check in Users collection
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null }
        );

        console.log(user);
        if (user) {
          console.log(`User ${user._id} disconnected.`);
          return;
        }

        // If neither a driver nor a user was found
        console.log(`Unknown user with socket ID ${socket.id} disconnected.`);
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });
};
