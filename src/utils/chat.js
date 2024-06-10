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

const formatDate = (date) => {
  const inputDate = new Date(date);
  const minutes =
    inputDate.getMinutes() < 10
      ? `0${inputDate.getMinutes()}`
      : inputDate.getMinutes();

  return (
    `${inputDate.getDate().toString().padStart(2, "0")}-${(
      inputDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${inputDate.getFullYear()} ${inputDate.getHours()}:` +
    minutes
  );
};
const getPartnerIdByLocation = () => {
  const pathName = window.location.pathname;
  const partnerId = pathName.split("/chat/");
  return Number(partnerId[partnerId.length - 1]);
};
export { formatMessage, formatDate, getPartnerIdByLocation };
