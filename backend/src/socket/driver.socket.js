export default (io, socket) => {
 

  // Notify a specific driver about a new ride
  const notifyDriver = ({ driverId, rideDetails }) => {
    io.to(driverId).emit("newRide", {
      message: "A new ride request has been assigned to you!",
      rideDetails,
    });
  };

  socket.on("driver:newRide", notifyDriver);
};
