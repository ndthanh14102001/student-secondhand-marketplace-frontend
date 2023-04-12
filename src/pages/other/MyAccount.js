import PropTypes from "prop-types";
import React, { Fragment, useCallback, useState, useEffect } from "react";
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

const MyAccount = ({ location }) => {
  const { pathname } = location;

  const user = getUserLogin();

  const { addToast } = useToasts();

  const [readonly, setReadonly] = useState(true);
  const [messageError, setMessageError] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  });

  const [inputValue, setInputValue] = useState({
    username: user.user.username,
    fullName: user.user.fullName,
    email: user.user.email,
    address: user.user.address,
    phone: user.user.phone,
    university: user.user.university
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

  async function fetchData() {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user.user.id + '?populate=*',
      method: "get",
    })
    if (response.type === RESPONSE_TYPE) {
      setUrlAvatar(process.env.REACT_APP_SERVER_ENDPOINT + response.data.avatar?.url);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setInputValue((prevData) => ({ ...prevData, [name]: value }));
    setIsChangeInput(true);
  }, []);

  const handleChangePassword = useCallback(({ target: { name, value } }) => {
    setInputPassword((prevData) => ({ ...prevData, [name]: value }))
  }, []);

  const handleChangeProfile = async () => {
    if (statusProfile === 0) {
      setReadonly(false);
      setButtonPressed(true);
      setStatusProfile(1);
    }
    else if (statusProfile === 1) {
      let toast = 0;
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
            university: inputValue.university
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
        console.log(reader.result);
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
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> Edit your account information{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>My Account Information</h4>
                              <h5>Your Personal Details</h5>
                            </div>
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
                                  <label>User Name</label>
                                  <input type="text" name="username" value={inputValue.username} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Full Name</label>
                                  <input type="text" name="fullName" value={inputValue.fullName} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Email </label>
                                  <input id="email" name="email" type="email" value={inputValue.email} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Address</label>
                                  <input id="address" name="address" type="email" value={inputValue.address} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Telephone</label>
                                  <input id="phone" name="phone" type="text" value={inputValue.phone} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>university</label>
                                  <input id="university" name="university" type="text" value={inputValue.university} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="button" onClick={handleChangeProfile}>Change</button>
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
                            <span>2 .</span> Change your password
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Current Password </label>
                                  <input type="password" name="currentPassword" onChange={handleChangePassword} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.currentPassword}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>New Password</label>
                                  <input type="password" name="password" onChange={handleChangePassword} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.password}</Typography>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input type="password" name="passwordConfirm" onChange={handleChangePassword} />
                                  <Typography color="error" sx={{ mt:1 }}>{messageError.passwordConfirm}</Typography>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="button" onClick={handlePasswordChange}>Change</button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
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
                    </Card>
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
