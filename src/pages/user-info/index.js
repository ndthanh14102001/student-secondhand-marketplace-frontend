import React, { Fragment } from "react";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  styled,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { ddmmyy } from "../../utils/DateFormat";
import ShopProducts from "../../wrappers/product/ShopProducts";
import {
  PRODUCT_ON_SALE_KEY,
  PRODUCT_SOLD_KEY,
} from "../../constants/my-products/constants";

import { getUniversityById } from "../../utils/data/university";
import { getImageUrl } from "../../utils/image";
import ReportDialog from "../../components/user-info/ReportDialog";
import useUserInfoHook from "../../hooks/user-info/UserInfoHook";
import RequestLoginDialog from "../../components/user-info/RequestLoginDialog";

function a11yProps(index) {
  return {
    id: `products-tab-${index}`,
    "aria-controls": `products-tabpanel-${index}`,
  };
}
const BoxUserInfo = styled(Box)(() => ({
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  width: "100%",
}));

const UserInfo = ({ match }) => {
  const userInfoHook = useUserInfoHook();

  return (
    <Fragment>
      <MetaTags>
        <title>Trang cá nhân của {userInfoHook.userInfo?.fullName}</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Trang chủ
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + userInfoHook.pathname}>
        Thông tin người bán
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="product-area pt-60 pb-60">
          <div className="container">
            <div className="row">
              <Paper sx={{ padding: "1rem", width: "100%" }}>
                <Box
                  sx={{
                    float: "right",
                    display: "flex",
                  }}
                >
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      ml: "8px",
                      fontSize: "10px",
                    }}
                    color="error"
                    variant="text"
                    startIcon={<ReportProblemOutlinedIcon />}
                    onClick={userInfoHook.handleClickOpenConfirmReport}
                  >
                    Tố cáo
                  </Button>
                  <ReportDialog
                    openConfirmReport={userInfoHook.openConfirmReport}
                    handleCloseConfirmReport={
                      userInfoHook.handleCloseConfirmReport
                    }
                    setOpenNeedLoginDialog={userInfoHook.setOpenNeedLoginDialog}
                    userInfo={userInfoHook.userInfo}
                  />

                  {/* Hộp thoại yêu cầu đăng nhập trước khi báo cáo người dùng */}
                  <RequestLoginDialog
                    handleCloseConfirmReport={
                      userInfoHook.handleCloseConfirmReport
                    }
                    openNeedLoginDialog={userInfoHook.openNeedLoginDialog}
                  />
                </Box>
                <Grid container>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={getImageUrl(userInfoHook.avatar)}
                      sx={{
                        width: "100px",
                        height: "100px",
                        border: "1px solid #ccc",
                      }}
                    ></Avatar>
                    <Box
                      marginLeft={"1rem"}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Typography fontWeight={"bold"} marginBottom={"1rem"}>
                        {userInfoHook.userInfo?.fullName}
                      </Typography>
                      {userInfoHook.isFollow ? (
                        <Button
                          sx={{ textTransform: "capitalize" }}
                          variant="outlined"
                          startIcon={<CheckIcon />}
                          onClick={userInfoHook.handleFollow}
                        >
                          Đang theo dõi
                        </Button>
                      ) : (
                        <Button
                          sx={{ textTransform: "capitalize" }}
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={userInfoHook.handleFollow}
                        >
                          Theo dõi
                        </Button>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <BoxUserInfo>
                      <CalendarMonthIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">
                        {"Ngày tham gia"}
                      </Typography>
                      <Typography marginLeft="1rem">
                        {ddmmyy(new Date(userInfoHook.userInfo?.createdAt))}
                      </Typography>
                    </BoxUserInfo>
                    <BoxUserInfo>
                      <SchoolIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">
                        {"Trường đại học"}
                      </Typography>
                      <Typography marginLeft="1rem">
                        {
                          getUniversityById(userInfoHook.userInfo?.universityId)
                            ?.teN_DON_VI
                        }
                      </Typography>
                    </BoxUserInfo>
                    <BoxUserInfo>
                      <LocationOnIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">
                        {"Địa chỉ nhà"}
                      </Typography>
                      <Typography marginLeft="1rem">
                        {userInfoHook.userInfo?.address}
                      </Typography>
                    </BoxUserInfo>
                    <BoxUserInfo>
                      <PhoneIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">
                        {"Số điện thoại"}
                      </Typography>
                      <Typography marginLeft="1rem">
                        {userInfoHook.userInfo?.phone}
                      </Typography>
                    </BoxUserInfo>
                  </Grid>
                </Grid>
              </Paper>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      margin: "2rem 0",
                    }}
                  >
                    <Tabs
                      value={userInfoHook.productStatusShow}
                      onChange={userInfoHook.handleChangeProductStatusShow}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        label="Sản phẩm đang bán"
                        {...a11yProps(PRODUCT_ON_SALE_KEY)}
                      />
                      <Tab
                        label="Sản phẩm đã bán"
                        {...a11yProps(PRODUCT_SOLD_KEY)}
                      />
                    </Tabs>
                  </Box>
                </Box>
                <ShopProducts
                  layout={"grid three-column"}
                  products={userInfoHook.productShow}
                />
              </Box>
            </div>
          </div>
        </div>
        <Dialog
          open={userInfoHook.openUnFollow}
          onClose={userInfoHook.handleCloseUnFollow}
        >
          <DialogTitle>
            {"Bạn có muốn hủy theo dõi người dùng này không?"}
          </DialogTitle>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={userInfoHook.handleCloseUnFollow}
              variant="contained"
              color="error"
            >
              không
            </Button>
            <Button onClick={userInfoHook.handleUnFollow} variant="contained">
              có
            </Button>
          </DialogActions>
        </Dialog>
      </LayoutOne>
    </Fragment>
  );
};

export default UserInfo;
