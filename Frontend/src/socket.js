// import { io } from "socket.io-client";

// const SOCKET_SERVER_URL = process.env.DomainUrl; // Replace with your backend URL

// const socket = io(SOCKET_SERVER_URL, {
//   transports: ["websocket"], // Ensures real-time communication
//   reconnection: true, // Enables automatic reconnection
//   reconnectionAttempts: 5, // Number of retries before failing
// });

// socket.on("order:new", (notification) => {
//   // send this notification to redux
//   console.log(notification);
// });

// export default socket;

import { io } from "socket.io-client";
import { addAllAppointment } from "/src/utility/Slice/AllAppointmentsSlice.js";

let socket;

export const initializeSocket = (dispatch) => {
  const SOCKET_SERVER_URL = process.env.DomainUrl;

  socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on("order:new", (notification) => {
    console.log("New order received:", notification);
    dispatch(addAllAppointment(notification)); // ✅ Dispatch action to Redux store
  });
};

export default socket;
