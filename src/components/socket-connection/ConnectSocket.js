import React, { useEffect } from "react";
import { getUserLogin } from "../../utils/userLoginStorage";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "../../redux/actions/socketActions";
import { io } from "socket.io-client";

const ConnectSocket = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state?.userStorage?.isLogin);
  useEffect(() => {
    if (isLogin) {
      connectSocket();
    }
  }, [isLogin]);

  function connectSocket() {
    let tokenArr = getUserLogin()?.token?.split(" ");
    if (tokenArr?.length >= 2) {
      const SERVER_URL = process.env.REACT_APP_SERVER_ENDPOINT;
      const setupSocket = io(SERVER_URL, {
        autoConnect: false,
      });

      setupSocket.auth = { token: tokenArr[1] };

      setupSocket.connect();

      setupSocket.on("connect", () => {
        dispatch(setSocket(setupSocket));
      });
    }
  }

  return <></>;
};

export default ConnectSocket;
