export default (io, socket) => {
  // Notify all drivers about a new order
  const notifyDrivers = (orderData) => {
    io.to("DriversRoom").emit("newOrder", {
      message: "A new order is available!",
      orderId: orderData.orderId,
    });
    console.log(`New order emitted to DriversRoom: ${orderData.orderId}`);
  };

  // Notify a specific user about order status
  const updateOrderStatus = ({ userId, status }) => {
    io.to(userId).emit("orderStatus", {
      message: `Your order status has been updated to ${status}`,
    });
  };

  // Register event listeners
  socket.on("order:create", notifyDrivers);
  socket.on("order:updateStatus", updateOrderStatus);
};
