import PropTypes from "prop-types";
import React, { Fragment, useCallback, useState, useEffect,useMemo } from "react";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import callApi, { RESPONSE_TYPE,STATUS_BAD_REQUEST } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { updateUser } from "../../utils/userLoginStorage";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ProductOwnerInfo from "../../wrappers/product/ProductOwnerInfo";
import { getAllUniversity } from "../../utils/data/university";

const MyAccount = ({ location }) => {
  const universityData = useMemo(() => {
    return Object.values(getAllUniversity());
  }, []);
  const { pathname } = location;

  const user = getUserLogin();

  const { addToast } = useToasts();

  const [readonly, setReadonly] = useState(true);
  const [messageError, setMessageError] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
    username: "",
    fullName: "",
    email: "",
    address: "",
    phone: "",
    universityId: ""
  });

  const [inputValue, setInputValue] = useState({
    username: user?.user?.username,
    fullName: user?.user?.fullName,
    email: user?.user?.email,
    address: user?.user?.address,
    phone: user?.user?.phone,
    universityId: user?.user?.universityId
  });

  const [inputPassword, setInputPassword] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  const [buttonPressed, setButtonPressed] = useState(false);

  const [statusProfile, setStatusProfile] = useState(0);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [urlAvatar, setUrlAvatar] = useState();
  const [fileAvatarInput, setFileAvatarInput] = useState(null);
  const [follower, setFollower] = useState([])
  const [listId, setListId] = useState([])
  const [isChangeList, setIsChangeList] = useState(false)

  async function fetchData() {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user?.user?.id ,
      method: "get",
      params: {
        populate: {
          avatar: true,
          user_followed: {
            populate: "*"
          }
        },
      }
    })
    if (response.type === RESPONSE_TYPE) {
      setUrlAvatar(process.env.REACT_APP_SERVER_ENDPOINT + response.data?.avatar?.url);
      const arr = response.data?.user_followed;
      setFollower(arr);
      arr.map((userFollow) => {
        setListId(prevList => prevList.concat(userFollow.id))
      })
    }
  }

  useEffect(() => {
    fetchData();
  }, [isChangeList]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setInputValue((prevData) => ({ ...prevData, [name]: value }));
    setIsChangeInput(true);
  }, []);

  const handleChangePassword = useCallback(({ target: { name, value } }) => {
    setInputPassword((prevData) => ({ ...prevData, [name]: value }))
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChangeProfile = async () => {
    if (statusProfile === 0) {
      setReadonly(false);
      setButtonPressed(true);
      setStatusProfile(1);
    }
    else if (statusProfile === 1) {
      let count = 0;
      let toast = 0;
      if(inputValue.username === ""){
        setMessageError((prev) => ({
          ...prev,
          username: "bạn chưa nhập tên tài khoản"
        }))
        count++;
      }
      else if(inputValue.username.trim().length < 6){
        setMessageError((prev) => ({
          ...prev,
          username: "bạn phải nhập tên tài khoản ít nhất 6 kí tự"
        }))
        count++;
      }
      if(inputValue.fullName === ""){
        setMessageError((prev) => ({
          ...prev,
          fullName: "bạn chưa nhập họ và tên"
        }))
        count++;
      }
      if(inputValue.email === ""){
        setMessageError((prev) => ({
          ...prev,
          email: "bạn chưa nhập email"
        }))
        count++;
      }
      else if(!emailRegex.test(inputValue.email.trim())){
        setMessageError((prev) => ({
          ...prev,
          email: "email của bạn chưa đúng định dạng"
        }))
        count++;
      }
      if(inputValue.address === ""){
        setMessageError((prev) => ({
          ...prev,
          address: "bạn chưa nhập địa chỉ của bạn"
        }))
        count++;
      }
      if(inputValue.phone === ""){
        setMessageError((prev) => ({
          ...prev,
          phone: "bạn chưa nhập số điện thoại"
        }))
        count++;
      }
      else if(inputValue.phone.trim().length > 11 || inputValue.phone.trim().length < 10){
        setMessageError((prev) => ({
          ...prev,
          phone: "bạn nhập sai số điện thoại"
        }))
        count++;
      }
      if(inputValue.universityId === ""){
        setMessageError((prev) => ({
          ...prev,
          universityId: "bạn chọn trường đại học"
        }))
        count++;
      }
      if(count === 0){
        if (isChangeInput) {
          const response = await callApi({
            url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user.user.id,
            method: "put",
            data: {
              username: inputValue.username,
              fullName: inputValue.fullName,
              email: inputValue.email,
              address: inputValue.address,
              phone: inputValue.phone,
              universityId: inputValue.universityId
            },
            // headers: {
            //   Authorization: user.token,
            // }
          })
          if (response.type === RESPONSE_TYPE) {
            toast++;
            updateUser(response.data);
          }
        }
      }
      if (isChangeAvatar) {

        let formData = new FormData();
        formData.append('files', fileAvatarInput);

        const response1 = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/upload",
          method: "post",
          data: formData,
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: user.token,
           },
        })
        if (response1.type === RESPONSE_TYPE) {
          const response2 = await callApi({
            url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user.user.id,
            method: "put",
            data: {
              "avatar": response1.data[0].id,
            },
            // headers: { 
            //   Authorization: user.token,
            // },
          })
          if (response2.type === RESPONSE_TYPE) {
            toast++;
          }
        }
      }
      if (toast > 0) {
        addToast("thay đổi thông tin cá nhân thành công", {
          appearance: "success",
          autoDismiss: true
        });
      }

      setReadonly(true);
      setButtonPressed(false);
      setStatusProfile(0);
    }
  }

  const handleOpenImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      setFileAvatarInput(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUrlAvatar(reader.result);
        };
        reader.readAsDataURL(file);
        // console.log(reader.result);
      }
    };
    input.click();
    setIsChangeAvatar(true);
  };

  const handlePasswordChange = async() => {
    let count = 0;
    if(inputPassword.currentPassword === ""){
      setMessageError((prev) => ({
        ...prev,
        currentPassword: "bạn chưa nhập mật khẩu hiện tại"
      }))
      count++;
    }
    if(inputPassword.password === ""){
      setMessageError((prev) => ({
        ...prev,
        password: "bạn chưa nhập mật khẩu mới"
      }))
      count++;
    }
    if(inputPassword.passwordConfirm === ""){
      setMessageError((prev) => ({
        ...prev,
        passwordConfirm: "bạn chưa nhập lại mật khẩu"
      }))
      count++;
    }
    if(count === 0 ){ 
      if(inputPassword.password !== inputPassword.passwordConfirm) {
        setMessageError((prev) => ({
          ...prev,
          passwordConfirm: "mật khẩu chưa chính xác"
        }))
      }
      else{
        setMessageError("");
        const response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/auth/change-password/",
          method: "post",
          data: {
            currentPassword: inputPassword.currentPassword,
            password: inputPassword.password,
            passwordConfirmation: inputPassword.passwordConfirm
          },
          headers: {
            Authorization: user.token,
          }
        })
        if (response.type === RESPONSE_TYPE) {
          addToast("thay đổi mật khẩu thành công", {
            appearance: "success",
            autoDismiss: true
          });
        }
        else {
          if (response.status === STATUS_BAD_REQUEST) {
            setMessageError("mật khẩu không chính xác!")
          }
        }
      }
    }
  }

  const handleChangeList = (isOpen) => {
    if (isOpen) {
      setIsChangeList(prev => !prev);
    } 
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Flone | My Account</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Thông tin của tôi
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-wrapper">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> Thông tin cá nhân{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            {/* <div className="account-info-wrapper">
                              <h4>Thông tin tài khoản của tôi</h4>
                            </div> */}
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <Avatar sx={{
                                    width: 150,
                                    height: 150,
                                    m: "auto",
                                  }}
                                    alt="avatar"
                                    src={urlAvatar ? urlAvatar : "abc"}
                                    onClick={readonly ? null : handleOpenImage}
                                    className={buttonPressed ? "input-style-active pointer" : ""}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Tên tài khoản</label>
                                  <input type="text" name="username" value={inputValue?.username} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.username}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Họ tên</label>
                                  <input type="text" name="fullName" value={inputValue?.fullName} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.fullName}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Email </label>
                                  <input id="email" name="email" type="email" value={inputValue?.email} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.email}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Địa chỉ</label>
                                  <input id="address" name="address" type="email" value={inputValue?.address} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.address}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Số điện thoại</label>
                                  <input id="phone" name="phone" type="number" value={inputValue?.phone} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.phone}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Trường đại học</label>
                                  <select id="universityId" name="universityId"  value={inputValue?.universityId} disabled={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"}>
                                    <option value="">--Chọn trường đại học của bạn--</option>
                                    {universityData.map((list,index)=>(
                                      <option key={index} value={list.id} >{list?.teN_DON_VI}</option>
                                    ))}
                                  </select>
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.universityId}</Typography>
                                  {/* <input id="university" name="university" type="text" value={inputValue.university} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} /> */}
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="button" onClick={handleChangeProfile}>Thay đổi</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> Thay đổi mật khẩu
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            {/* <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div> */}
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Mật khẩu hiện tại </label>
                                  <input type="password" name="currentPassword" onChange={handleChangePassword} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.currentPassword}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Mật khẩu mới</label>
                                  <input type="password" name="password" onChange={handleChangePassword} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.password}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Nhập lại mật khẩu</label>
                                  <input type="password" name="passwordConfirm" onChange={handleChangePassword} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.passwordConfirm}</Typography>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="button" onClick={handlePasswordChange}>Thay đổi</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20 product-details-content">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            <span>3 .</span> Danh sách người theo dõi{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          {
                            follower.length === 0 ? 
                            <Typography> abc</Typography> :
                            follower.map((fl,index) => (
                              <ProductOwnerInfo key={index} user={fl} check={2} listFollow={listId} changeList={handleChangeList} />
                            ))
                          }
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    {/* <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="2">
                          <h3 className="panel-title">
                            <span>3 .</span> Modify your address book entries{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="2">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Address Book Entries</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>Farhana hayder (shuvo) </p>
                                    <p>hastech </p>
                                    <p> Road#1 , Block#c </p>
                                    <p> Rampura. </p>
                                    <p>Dhaka </p>
                                    <p>Bangladesh </p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit">Edit</button>
                                    <button>Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card> */}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object
};

export default MyAccount;
