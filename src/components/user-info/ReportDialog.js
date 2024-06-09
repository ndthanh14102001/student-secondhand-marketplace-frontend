import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  List,
  TextField,
  InputAdornment,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import useReportDialogHook from "../../hooks/user-info/ReportDialogHook";
import { REPORT_CRITERIA } from "../../constants/user-info/constants";

const ReportDialog = ({
  userInfo,
  openConfirmReport,
  handleCloseConfirmReport,
  setOpenNeedLoginDialog,
}) => {
  const reportDialogHook = useReportDialogHook({
    userInfo,
    handleCloseConfirmReport,
    setOpenNeedLoginDialog,
  });
  return (
    <Dialog
      open={openConfirmReport}
      onClose={reportDialogHook.handleCloseConfirmReport}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{}}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        {"Báo cáo người dùng"}
      </DialogTitle>
      <DialogContent sx={{ width: "450px" }}>
        <DialogContentText id="alert-dialog-description">
          Người dùng "{userInfo?.fullName}" có vấn đề gì ?
        </DialogContentText>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          {REPORT_CRITERIA?.map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={value} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={reportDialogHook.handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        reportDialogHook.checkedReportCriteria.indexOf(
                          value
                        ) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <TextField
          fullWidth
          label="Mô tả chi tiết"
          id="outlined-start-adornment"
          sx={{ padding: 0, mt: "12px" }}
          value={reportDialogHook.reportDetailInput}
          onChange={(event) => {
            reportDialogHook.setReportDetailInput(event.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <InfoIcon />
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={reportDialogHook.handleCloseConfirmReport}
          sx={{ textTransform: "none" }}
        >
          Thoát
        </Button>
        <Button
          onClick={reportDialogHook.handleReport}
          sx={{ textTransform: "none" }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;
