const formatMessage = ({
  id,
  createdAt,
  updatedAt,
  content,
  senderId,
  senderAttribute,
  receiverId,
  receiverAttribute,
}) => {
  return {
    id: id,
    attributes: {
      createdAt: createdAt,
      updatedAt: updatedAt,
      message: content,
      read: false,
      sender: {
        data: {
          id: senderId,
          attributes: senderAttribute,
        },
      },
      receiver: {
        data: {
          id: receiverId,
          attributes: receiverAttribute,
        },
      },
    },
  };
};
export { formatMessage };
