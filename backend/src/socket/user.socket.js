
export default (io, socket) => {

  const notifyUser = ({ userId, message }) => {
    io.to(userId).emit("userNotification", { message });
  };

  socket.on("user:notify", notifyUser);
};
