import ChatsNavigator from './ChatsNavigator'
import ChatFrame from './ChatFrame'
import React, { Fragment, useEffect, useState } from 'react'
import LayoutOne from '../../layouts/LayoutOne'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { MetaTags } from 'react-meta-tags'
import { useLocation } from 'react-router-dom'
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb'
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
import { getUserLogin } from "../../utils/userLoginStorage";
import LoginRegister from "../other/LoginAndRegister";
import axios from 'axios'

function ChatsFrame({ match }) {

  const { pathname } = useLocation();  
  // const attributes = product?.attributes;
  const userLoginData = getUserLogin()?.user;

  // Thông tin người bán hiện tại
  const [user, setUser] = useState();

  const handleChangeSeller = (info) => {  
    setUser(info)
  }

  // Lấy thông tin người bán hiện tại
  useEffect(() => {
    const getUserInfo = async () => {
      const userId = match.params.id;
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
        method: "get",
      });
      if (response.type === RESPONSE_TYPE) {
        setUser(response.data);
      }
    }
    getUserInfo();
  }, [match])

  //Lấy thông tin tất cả người dùng (TẠM THỜI CHƯA DÙNG TỚI)
  // axios.get(process.env.REACT_APP_API_ENDPOINT + '/users')
  // .then((response) => {
  //   console.log(response)
    
  // })

  return (
    <Fragment>
      <MetaTags>
        <title>Student Market | Trò chuyện</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Chat với người bán
      </BreadcrumbsItem>
      <LayoutOne 
      headerTop="visible"
      >
        <Breadcrumb />
        <div className="product-area pt-60 pb-60">
          <div className="container">
            <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <div style={{ marginLeft: '8px', marginTop: '8px' }}>
                  <ChatsNavigator 
                    handleChangeSeller={handleChangeSeller} 
                    userLoginData={userLoginData}
                  />
                </div>
                <div style={{ marginLeft: '8px', marginTop: '8px' }}>
                  <ChatFrame 
                    sellerData={user !== undefined && user} 
                    userLoginData={userLoginData}
                  />
                </div>
              </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  )
}

export default ChatsFrame
