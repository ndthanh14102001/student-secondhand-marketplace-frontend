const SHOW_CHAT_BUBBLE = "SHOW_CHAT_BUBBLE";
const HIDE_CHAT_BUBBLE = "HIDE_CHAT_BUBBLE";

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

export { SHOW_CHAT_BUBBLE, HIDE_CHAT_BUBBLE, showChatBubble, hideChatBubble };
