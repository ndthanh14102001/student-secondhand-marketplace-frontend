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

socket.auth = {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgxNjI2Mzk2LCJleHAiOjE2ODQyMTgzOTZ9.DdikAfqyzXmVmQgSlI1EPL2PJmZ01pHR3VBmoUp9Id0"}

socket.connect();

socket.emit("private message", {
  content: "Ek mày",
  to: 1,
});

let content = "Test thử socket"
// socket.emit("notification", content);

socket.on("disconnect", () => {
  console.log(socket.connected); // false
});

