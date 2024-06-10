import { formatMessage, getPartnerIdByLocation } from "../../utils/chat";
import { getUserLogin } from "../../utils/userLoginStorage";

export const SET_SOCKET = "SET_SOCKET";
export const SET_CHATS = "SET_CHATS";
export const ADD_CHAT = "ADD_CHAT";
export const SET_NUMBER_OF_UNREAD_MESSAGES = "SET_NUMBER_OF_UNREAD_MESSAGES";
export const NEW_MESSAGE = "NEW_MESSAGE";

export const SET_PARTNERS = "SET_PARTNERS";
export const ADD_SEEN_COUNT = "ADD_SEEN_COUNT";
export const CLEAR_SEEN_COUNT = "CLEAR_SEEN_COUNT";
export const socketInitState = {
  socket: null,
  chats: [],
  numberOfUnreadMessages: [],
  partners: [],
};
const movePartnerToTop = (partners, index) => {
  partners.unshift(partners.splice(index, 1)[0]);
};

const socketReducer = (state = socketInitState, action) => {
  switch (action.type) {
    case SET_SOCKET: {
      return {
        ...state,
        socket: action.payload,
      };
    }
    case SET_CHATS: {
      return {
        ...state,
        chats: action.payload,
      };
    }
    case ADD_CHAT: {
      return {
        ...state,
        chats: [action.payload, ...state.chats],
      };
    }
    case SET_NUMBER_OF_UNREAD_MESSAGES: {
      return {
        ...state,
        numberOfUnreadMessages: action.payload,
      };
    }
    case SET_PARTNERS: {
      return {
        ...state,
        partners: action.payload,
      };
    }
    case ADD_SEEN_COUNT: {
      const oldPartners = state.partners;
      const partnerId = action.payload.partnerId;
      for (let index = 0; index < oldPartners?.length; index++) {
        const oldPartner = oldPartners[index];
        if (oldPartner?.user_id === partnerId) {
          oldPartner.seencount = Number(oldPartner.seencount) + 1;
          movePartnerToTop(oldPartners, index);
          break;
        }
      }
      return {
        ...state,
        partners: [...oldPartners],
      };
    }
    case CLEAR_SEEN_COUNT: {
      const oldPartners = state.partners;
      const partnerId = action.payload.partnerId;
      for (let index = 0; index < oldPartners?.length; index++) {
        const oldPartner = oldPartners[index];
        if (oldPartner?.user_id === partnerId) {
          oldPartner.seencount = 0;
          break;
        }
      }
      return {
        ...state,
        partners: [...oldPartners],
      };
    }
    case NEW_MESSAGE: {
      const loggedInUser = getUserLogin()?.user;
      const partnerId = getPartnerIdByLocation();
      const message = action.payload;
      if (partnerId === message?.from?.id) {
        state.chats = [
          formatMessage({
            id: message?.id,

            content: message?.content,
            createdAt: new Date(),
            updatedAt: new Date(),

            receiverId: loggedInUser?.id,
            receiverAttribute: {
              username: loggedInUser?.username,
            },
            senderId: message?.from?.id,
            senderAttribute: {
              username: "",
            },
          }),
          ...state.chats,
        ];
      }
      state.numberOfUnreadMessages++;
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};
export default socketReducer;
