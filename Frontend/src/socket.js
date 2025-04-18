import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.DomainUrl; // Replace with your backend URL

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"], // Ensures real-time communication
  reconnection: true, // Enables automatic reconnection
  reconnectionAttempts: 5, // Number of retries before failing
});

socket.on("order:new", (notification) => {
  console.log(notification);
});

export default socket;
