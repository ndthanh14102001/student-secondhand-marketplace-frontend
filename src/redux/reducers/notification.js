export const SET_NOTIFICATION = "SET_NOTIFICATION";
export const ADD_NOTIFICATION_TO_TOP = "ADD_NOTIFICATION";
export const SET_UNREAD_NOTIFICATION = "SET_UNREAD_NOTIFICATION";
export const ADD_UNREAD_NOTIFICATION = "ADD_UNREAD_NOTIFICATION";
export const filterInitState = {
  notifications: [],
  unreadNotifications: [],
};

const notificationReducer = (state = filterInitState, action) => {
  switch (action.type) {
    case SET_NOTIFICATION: {
      return {
        ...state,
        notifications: action.payload,
      };
    }
    case ADD_NOTIFICATION_TO_TOP: {
      state.notifications.unshift();
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    }
    case SET_UNREAD_NOTIFICATION: {
      return {
        ...state,
        unreadNotifications: action.payload,
      };
    }
    case ADD_UNREAD_NOTIFICATION: {
      return {
        ...state,
        unreadNotifications: [action.payload, ...state.unreadNotifications],
      };
    }
    default: {
      return state;
    }
  }
};
export default notificationReducer;
