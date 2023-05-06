import { io } from "socket.io-client";
// const SERVER_URL = "http://localhost:3000";
const SERVER_URL = "http://35.240.158.158";
const socket = io(SERVER_URL, {
  autoConnect: false
});

//  wait until socket connects before adding event listeners
// socket.on("connect", () => {
//   console.log(socket.connected); // true
// });

socket.auth = {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgzMzg3MTg0LCJleHAiOjE2ODU5NzkxODR9.cR8_3PcqB_8ZmISqeAqiKSlxu9Cq7oM13ohnnoDgjJU"}

socket.connect();

// socket.emit("private message", {
//   content: "Hello",
//   to: 3,
// });
let content = "Hello everyone"
socket.emit("notification", content);

socket.on("disconnect", () => {
  console.log(socket.connected); // false
});

