import ChatsNavigator from './ChatsNavigator'
import ChatFrame from './ChatFrame'
import React, { Fragment } from 'react'
import LayoutOne from '../../layouts/LayoutOne'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { MetaTags } from 'react-meta-tags'
import { useLocation } from 'react-router-dom'
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb'

function ChatsFrame() {

  const { pathname } = useLocation();

  return (
    <Fragment>
      <MetaTags>
        <title>Student Market | Thông tin người bán</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Thông tin người bán
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
                  <ChatsNavigator />
                </div>
                <div style={{ marginLeft: '8px', marginTop: '8px' }}>
                  <ChatFrame />
                </div>
              </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  )
}

export default ChatsFrame
