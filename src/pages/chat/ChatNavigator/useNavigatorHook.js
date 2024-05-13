import React, { useEffect, useState } from "react";
import chatApi from "../../../api/chat";
import { RESPONSE_TYPE } from "../../../utils/callApi";

const useNavigatorHook = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    console.log("render");
    (async function getPartnerts() {
      const response = await chatApi.getPartners();
      if (response.type === RESPONSE_TYPE) {
        setPartners(response?.partners || []);
      }
    })();
  }, []);
  return { partners };
};

export default useNavigatorHook;
