import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import chatApi from "../../api/chat";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { clearSeenCountByPartnerId ,setPartners} from "../../redux/actions/socketActions";
const useChatNavigatorHook = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const partners = useSelector((state) => state.socket.partners);

  useEffect(() => {
    (async function getPartnerts() {
      const response = await chatApi.getPartners();
      if (response.type === RESPONSE_TYPE) {
        dispatch(setPartners(response?.partners || []));
      }
    })();
  }, []);

  const onClickUser = (userId) => {
    dispatch(clearSeenCountByPartnerId({ partnerId: userId }));
    history.push("/chat/" + userId);
  };
  return { partners, onClickUser };
};

export default useChatNavigatorHook;
