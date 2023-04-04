import PropTypes from "prop-types";
import React, { Fragment,useCallback,useState } from "react";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { rememberLogin } from "../../utils/userLoginStorage";

const MyAccount = ({ location }) => {
  const { pathname } = location;

  const user = getUserLogin();

  const { addToast } = useToasts();

  const [readonly, setReadonly] = useState(true);

  const [inputValue, setInputValue] = useState({
    username: user.user.username,
    fullName: user.user.fullName,
    email: user.user.email,
    address: user.user.address,
    phone: user.user.phone,
    university: user.user.university
  });

  const [buttonPressed, setButtonPressed] = useState(false);

  const [statusProfile, setStatusProfile] = useState(0);
  const [isChangeInput, setIsChangeInput] = useState(false);

  const handleInputChange = useCallback(({target: {name, value}}) => {
    setInputValue((prevData) => ({ ...prevData, [name]: value}))
    setIsChangeInput(true);
  }, []);

  const handleChangeProfile =  async() =>{
    if(statusProfile === 0){
      setReadonly(false);
      setButtonPressed(true);
      setStatusProfile(1);
    }
    else if(statusProfile === 1){
      if(isChangeInput){
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
        }
      })

      if (response.type === RESPONSE_TYPE) {
        addToast("thay đổi thông tin cá nhân thành công", {
          appearance: "success",
          autoDismiss: true
        });
        // rememberLogin(response.data?.jwt, response.data?.user);
      }
    } 
      setReadonly(true);
      setButtonPressed(false);
      setStatusProfile(0);
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
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>User Name</label>
                                  <input type="text" name="username" value={inputValue.username} readOnly={readonly} onChange={handleInputChange} className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Full Name</label>
                                  <input type="text" name="fullName" value={inputValue.fullName} readOnly={readonly} onChange={handleInputChange}  className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Email </label>
                                  <input id="email" name="email"  type="email" value={inputValue.email} readOnly={readonly} onChange={handleInputChange}  className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Address</label>
                                  <input id="address" name="address" type="email" value={inputValue.address} readOnly={readonly} onChange={handleInputChange}  className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Telephone</label>
                                  <input id="phone" name="phone" type="text" value={inputValue.phone} readOnly={readonly} onChange={handleInputChange}  className={buttonPressed ? "input-style-active" : "input-style"} />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>university</label>
                                  <input id="university" name="university" type="text" value={inputValue.university} readOnly={readonly} onChange={handleInputChange}  className={buttonPressed ? "input-style-active" : "input-style"} />
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
                                  <label>Password</label>
                                  <input type="password" />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input type="password" />
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
