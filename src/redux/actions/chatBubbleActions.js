const SHOW_CHAT_BUBBLE = "SHOW_CHAT_BUBBLE";
const HIDE_CHAT_BUBBLE = "HIDE_CHAT_BUBBLE";
const UPDATE_NUMBER_OF_UNREAD_MESSAGES = "UPDATE_NUMBER_OF_UNREAD_MESSAGES";

const showChatBubble = () => {
  return {
    type: SHOW_CHAT_BUBBLE,
  };
};

const hideChatBubble = () => {
  return {
    type: HIDE_CHAT_BUBBLE,
  };
};

const updateNumberOfUnreadMessages = () => {
  return {
    type: UPDATE_NUMBER_OF_UNREAD_MESSAGES,
  };
};
export {
  SHOW_CHAT_BUBBLE,
  HIDE_CHAT_BUBBLE,
  UPDATE_NUMBER_OF_UNREAD_MESSAGES,
  showChatBubble,
  hideChatBubble,
  updateNumberOfUnreadMessages
};
