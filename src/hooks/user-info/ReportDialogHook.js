import React from "react";
import axios from "axios";

import { getUserLogin } from "../../utils/userLoginStorage";
import { useToasts } from "react-toast-notifications";
import { useParams } from "react-router-dom";
const useReportDialogHook = ({
  userInfo,
  handleCloseConfirmReport,
  setOpenNeedLoginDialog,
}) => {
  const { addToast } = useToasts();
  const params = useParams();
  const userId = params?.id;
  const [checkedReportCriteria, setCheckedReportCriteria] = React.useState([]);
  const [reportDetailInput, setReportDetailInput] = React.useState("");

  const userLoginData = getUserLogin()?.user;

  const handleToggle = (value) => () => {
    const currentIndex = checkedReportCriteria.indexOf(value);
    const newChecked = [...checkedReportCriteria];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedReportCriteria(newChecked);
  };

  const handleReport = () => {
    let descriptionInput = checkedReportCriteria
      .filter((fruit) => fruit !== "Lý do khác")
      .join(", ");
    if (checkedReportCriteria.indexOf("Lý do khác") > 0) {
      descriptionInput += " và lý do khác";
    }
    if (reportDetailInput !== "") {
      descriptionInput += ", mô tả chi tiết: " + reportDetailInput;
    }

    axios
      .post(process.env.REACT_APP_API_ENDPOINT + "/reports", {
        data: {
          type: "user",
          product: null,
          reporter: userLoginData.id,
          accused: userId,
          description: descriptionInput,
        },
      })
      .then((response) => {
        addToast(
          `Báo cáo người dùng "${userInfo?.fullName}" thành công. cảm ơn bạn đã báo cáo`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
        // setOpenReportSuccessSnackbar(true)
        handleCloseConfirmReport();
      })
      .catch((error) => {
        addToast(`Có lỗi xảy ra, báo cáo thất bại !`, {
          appearance: "error",
          autoDismiss: true,
        });
        handleCloseConfirmReport();
      });
  };
  return {
    setOpenNeedLoginDialog,
    checkedReportCriteria,
    setCheckedReportCriteria,
    reportDetailInput,
    setReportDetailInput,
    handleCloseConfirmReport,
    handleToggle,
    handleReport,
  };
};

export default useReportDialogHook;
