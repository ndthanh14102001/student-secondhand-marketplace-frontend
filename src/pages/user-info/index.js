import PropTypes from "prop-types";
import { connect, useDispatch } from 'react-redux';
import React, { useEffect, useMemo, useState, Fragment } from 'react'
import { useToasts } from "react-toast-notifications";
import { useLocation } from 'react-router-dom';
import { MetaTags } from 'react-meta-tags'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { Avatar, Box, Button, Grid, Paper, Tab, Tabs, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, styled, ListItem, IconButton, ListItemButton, ListItemIcon, Checkbox, ListItemText, List, TextField, InputAdornment, FormControl } from '@mui/material';
import axios from "axios";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import InfoIcon from '@mui/icons-material/Info';

import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
import { onShowPopupErrorBase } from '../../redux/actions/popupErrorBaseActions';
import { onCloseModalLoading, onOpenModalLoading } from '../../redux/actions/modalLoadingActions';
import { ddmmyy } from '../../utils/DateFormat';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { PRODUCT_ON_SALE_KEY, PRODUCT_SOLD_KEY } from '../other/my-products/constants';
import { PRODUCT_ON_SALE_STATUS, PRODUCT_SOLD_STATUS } from '../../constants';

import { onShowPopup } from '../../redux/actions/popupActions';
import { POPUP_TYPE_ERROR } from '../../redux/reducers/popupReducer';
import { onClosePopup } from '../../redux/actions/popupActions';

import { getUserLogin } from "../../utils/userLoginStorage";
import { getUniversityById } from "../../utils/data/university";

function a11yProps(index) {
  return {
    id: `products-tab-${index}`,
    'aria-controls': `products-tabpanel-${index}`,
  };
}
const BoxUserInfo = styled(Box)(() => ({
  marginBottom: "1rem",
  display: "flex",
  alignItems: "center",
  width: "100%"
}));

const user = getUserLogin()?.user;


const UserInfo = ({ match }) => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const userId = match.params.id
  const { pathname } = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [openUnFollow, setOpenUnFollow] = useState(false);
  const [listIdFollow, setListIdFollow] = useState([]);

  const avatar = useMemo(() => {
    return userInfo?.avatar?.url;
  }, [userInfo]);

  const [productStatusShow, setProductSatusShow] = React.useState(PRODUCT_ON_SALE_KEY);

  const handleChangeProductStatusShow = (event, newValue) => {
    setProductSatusShow(newValue);
  };
  const productShow = useMemo(() => {
    if (userInfo?.product && Array.isArray(userInfo.product)) {
      return userInfo.product.filter((product) => {
        const statusShow = productStatusShow === PRODUCT_ON_SALE_KEY ? PRODUCT_ON_SALE_STATUS : PRODUCT_SOLD_STATUS;
        return product?.status === statusShow
      })
    }
    return [];
  }, [userInfo, productStatusShow]);
  useEffect(() => {
    const getUserInfo = async () => {
      dispatch(onOpenModalLoading())
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
        method: "get",
        params: {
          populate: {
            product: {
              populate: {
                images: {
                  populate: "*"
                },
                userId: {
                  populate: {
                    avatar: {
                      populate: "*"
                    },
                    product: {
                      populate: "*"
                    },
                    followers: {
                      populate: "*"
                    }
                  }
                }
              },
            },
            avatar: {
              populate: "*"
            },
            followers: {
              populate: "*"
            }
          }
        }
      })
      if (response.type === RESPONSE_TYPE) {
        const responseData = response.data;
        setUserInfo(responseData);
        if (user) {
          responseData.followers?.map((follower) => {
            setListIdFollow(prevList => prevList.concat(follower.id));
            if (follower.id === user?.id) {
              setIsFollow(true);
            }
          })
        }
      } else {
        dispatch(onShowPopupErrorBase(response))
      }
      dispatch(onCloseModalLoading())
    }
    getUserInfo();
  }, [userId]);

  const handleCloseUnFollow = () => {
    setOpenUnFollow(false);
  }

  const handleUnFollow = async () => {
    let list = listIdFollow.filter((item) => item !== user.id);
    setListIdFollow(listIdFollow.filter((item) => item !== user.id));
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
      method: "put",
      data: {
        "followers": list,
      },
    })
    if (response.type === RESPONSE_TYPE) {
      addToast("Hủy theo dõi thành công", {
        appearance: "success",
        autoDismiss: true
      });
      setIsFollow(false);
      setOpenUnFollow(false);
    }

  }

  const handleFollow = async () => {
    if (isFollow) {
      setOpenUnFollow(true)
    }
    else {
      if (user) {
        let list = listIdFollow.concat(user.id);
        setListIdFollow(listIdFollow.concat(user.id));
        const response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
          method: "put",
          data: {
            "followers": list,
          },
        })
        if (response.type === RESPONSE_TYPE) {
          addToast("Theo dõi thành công", {
            appearance: "success",
            autoDismiss: true
          });
          setIsFollow(true);
        }
      }
      else {
        dispatch(onShowPopup({
          type: POPUP_TYPE_ERROR,
          title: "Đăng nhập",
          content: "Hãy quay lại đăng nhập để bình luận",
          showButtonCancel: false,
          closeAction: () => dispatch(onClosePopup()),
          clickOkeAction: () => dispatch(onClosePopup()),
        }))
      }
    }
  }

  //Function Report
  const [openConfirmReport, setOpenConfirmReport] = React.useState(false);
  const [openNeedLoginDialog, setOpenNeedLoginDialog] = React.useState(false);
  const userLoginData = getUserLogin()?.user;

  const reportCriteria = [
    "Xúc phạm khách hàng",
    "Lừa đảo",
    "Ảnh đại diện không phù hợp",
    "Thông tin cá nhân không đúng",
    "Lý do khác"
  ]

  const handleClickOpenConfirmReport = () => {
    if (userLoginData === undefined) {
      setOpenNeedLoginDialog(true);
    } else {
      setOpenConfirmReport(true);
    }
  };

  const handleCloseConfirmReport = () => {
    setOpenConfirmReport(false);
    setOpenNeedLoginDialog(false);
  };

  const [checkedReportCriteria, setCheckedReportCriteria] = React.useState([]);
  const [reportDetailInput, setReportDetailInput] = React.useState('');
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

  // useEffect(() => {
  //   let description = checkedReportCriteria.filter(fruit => fruit !== "Lý do khác").join(", ");
  //   if(checkedReportCriteria.indexOf("Lý do khác") > 0){
  //     description += " và lý do khác"
  //   }
  //   if(reportDetailInput !== ''){
  //     description += ", mô tả chi tiết: " + reportDetailInput
  //   }

  //   
  // }, [checkedReportCriteria, reportDetailInput]);

  const handleReport = () => {
    let descriptionInput = checkedReportCriteria.filter(fruit => fruit !== "Lý do khác").join(", ");
    if (checkedReportCriteria.indexOf("Lý do khác") > 0) {
      descriptionInput += " và lý do khác"
    }
    if (reportDetailInput !== '') {
      descriptionInput += ", mô tả chi tiết: " + reportDetailInput
    }

    axios
      .post(process.env.REACT_APP_API_ENDPOINT + '/reports',
        {
          data: {
            type: 'user',
            product: null,
            reporter: userLoginData.id,
            accused: userId,
            description: descriptionInput,
          }
        })
      .then((response) => {
        
        addToast(`Báo cáo người dùng "${userInfo?.fullName}" thành công. cảm ơn bạn đã báo cáo`, {
          appearance: "success",
          autoDismiss: true
        });
        // setOpenReportSuccessSnackbar(true)
        handleCloseConfirmReport();
      })
      .catch((error) => {
        addToast(`Có lỗi xảy ra, báo cáo thất bại !`, {
          appearance: "error",
          autoDismiss: true
        });
        handleCloseConfirmReport();
      })
  }

  // End function report
  return (
    <Fragment>
      <MetaTags>
        <title>Trang cá nhân của {userInfo?.fullName}</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Thông tin người bán
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="product-area pt-60 pb-60">
          <div className="container">
            <div className="row">
              <Paper sx={{ padding: "1rem", width: "100%" }}>
                <Box sx={{
                  float: 'right',
                  display: 'flex',
                }}>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      ml: '8px',
                      fontSize: '10px'
                    }}
                    color="error"
                    variant='text'
                    startIcon={<ReportProblemOutlinedIcon />}
                    onClick={handleClickOpenConfirmReport}>
                    Tố cáo
                  </Button>

                  {/* Hộp thoại báo cáo người dùng */}
                  <Dialog
                    open={openConfirmReport}
                    onClose={handleCloseConfirmReport}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{}}
                  >
                    <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {"Báo cáo người dùng"}
                    </DialogTitle>
                    <DialogContent sx={{ width: '450px' }}>
                      <DialogContentText id="alert-dialog-description">
                        Người dùng "{userInfo?.fullName}" có vấn đề gì ?
                      </DialogContentText>
                      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {reportCriteria?.map((value) => {
                          const labelId = `checkbox-list-label-${value}`;

                          return (
                            <ListItem
                              key={value}
                              disablePadding
                            >
                              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={checkedReportCriteria.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
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
                        sx={{ padding: 0, mt: '12px' }}
                        value={reportDetailInput}
                        onChange={(event) => { setReportDetailInput(event.target.value) }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><InfoIcon /></InputAdornment>,
                        }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseConfirmReport} sx={{ textTransform: 'none' }}>Thoát</Button>
                      <Button onClick={handleReport} sx={{ textTransform: 'none' }}>
                        Xác nhận
                      </Button>
                    </DialogActions>
                  </Dialog>

                  {/* Hộp thoại yêu cầu đăng nhập trước khi báo cáo người dùng */}
                  <Dialog
                    open={openNeedLoginDialog}
                    onClose={handleCloseConfirmReport}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      Hello bạn ơi
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Bạn cần phải đăng nhập để có thể tố cáo
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseConfirmReport} sx={{ textTransform: 'none' }}>Thoát</Button>
                      <a href={process.env.PUBLIC_URL + "/login-register"}>
                        <Button sx={{ textTransform: 'none' }}>
                          Đăng nhập
                        </Button>
                      </a>
                    </DialogActions>
                  </Dialog>
                </Box>
                <Grid container>
                  <Grid item xs={6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                    <Avatar
                      src={`${process.env.REACT_APP_SERVER_ENDPOINT}${avatar}`}
                      sx={{ width: "100px", height: "100px", border: "1px solid #ccc" }}>
                    </Avatar>
                    <Box marginLeft={"1rem"} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography fontWeight={"bold"} marginBottom={"1rem"}>{userInfo?.fullName}</Typography>
                      {
                        isFollow ?
                          <Button sx={{ textTransform: "capitalize" }} variant='outlined' startIcon={<CheckIcon />} onClick={handleFollow}>Đang theo dõi</Button> :
                          <Button sx={{ textTransform: "capitalize" }} variant='contained' startIcon={<AddIcon />} onClick={handleFollow}>Theo dõi</Button>
                      }
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <BoxUserInfo >
                      <CalendarMonthIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">{"Ngày tham gia"}</Typography>
                      <Typography marginLeft="1rem">{ddmmyy(new Date(userInfo?.createdAt))}</Typography>
                    </BoxUserInfo>
                    <BoxUserInfo >
                      <SchoolIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">{"Trường đại học"}</Typography>
                      <Typography marginLeft="1rem">{getUniversityById(userInfo?.universityId)?.teN_DON_VI}</Typography>
                    </BoxUserInfo>
                    <BoxUserInfo >
                      <LocationOnIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">{"Địa chỉ nhà"}</Typography>
                      <Typography marginLeft="1rem">{userInfo?.address}</Typography>
                    </BoxUserInfo>
                    <BoxUserInfo >
                      <PhoneIcon />
                      <Typography fontWeight={"bold"} marginLeft="1rem">{"Số điện thoại"}</Typography>
                      <Typography marginLeft="1rem">{userInfo?.phone}</Typography>
                    </BoxUserInfo>
                  </Grid>
                </Grid>
              </Paper>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: "2rem 0" }}>
                    <Tabs value={productStatusShow} onChange={handleChangeProductStatusShow} aria-label="basic tabs example">
                      <Tab label="Sản phẩm đang bán" {...a11yProps(PRODUCT_ON_SALE_KEY)} />
                      <Tab label="Sản phẩm đã bán" {...a11yProps(PRODUCT_SOLD_KEY)} />
                    </Tabs>
                  </Box>
                </Box>
                <ShopProducts layout={'grid three-column'} products={productShow} />
              </Box>
            </div>
          </div>
        </div>
        <Dialog open={openUnFollow} onClose={handleCloseUnFollow}>
          <DialogTitle>{'Bạn có muốn hủy theo dõi người dùng này không?'}</DialogTitle>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={handleCloseUnFollow} variant="contained" color="error">
              không
            </Button>
            <Button onClick={handleUnFollow} variant="contained">
              có
            </Button>
          </DialogActions>
        </Dialog>
      </LayoutOne>
    </Fragment >
  )
}

export default UserInfo