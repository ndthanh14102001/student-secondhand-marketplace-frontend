import PropTypes from "prop-types";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import { useEffect } from "react";
import { getUserLogin } from "../../utils/userLoginStorage";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import SendIcon from '@mui/icons-material/Send';
import { Box,Paper,InputBase,Avatar } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import { useDispatch } from 'react-redux';
import { onShowPopup } from '../../redux/actions/popupActions';
import { POPUP_TYPE_ERROR } from '../../redux/reducers/popupReducer';
import { onClosePopup } from '../../redux/actions/popupActions';

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, id }) => {

  const user = getUserLogin();

  const [urlAvatar, setUrlAvatar] = useState();
  const [listComments, setListComments] = useState([]);
  const [comment, setComment] = useState();

  const { addToast } = useToasts();
  const dispatch = useDispatch();

  async function getUrlAvatar() {
    if(user !== null){
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user.user.id + '?populate=*',
        method: "get",
      })
      if (response.type === RESPONSE_TYPE) {
        setUrlAvatar(process.env.REACT_APP_SERVER_ENDPOINT + response.data.avatar?.url);
      }
    }
    else
      setUrlAvatar("abc");
  }

  async function fetchData() {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/comments",
      method: "get",
      headers: { 
        'Content-Type': 'application/json',
        // Authorization: user.token,
      },
      params: {
        filters: {
          product: id
        },
        populate: "user.avatar"
      }
    })
    if (response.type === RESPONSE_TYPE) {
      setListComments(response.data.data);
    }
    console.log(response.data.data)
  }

  useEffect(() => {
    fetchData();
    getUrlAvatar();
  }, []);

  const formatDate = (date) => {
    const inputDate = new Date(date);
    const minutes = inputDate.getMinutes() < 10 ? `0${inputDate.getMinutes()}`: inputDate.getMinutes();
    
    return `${inputDate.getDate().toString().padStart(2, '0')}-${(inputDate.getMonth() + 1).toString().padStart(2, '0')}-${inputDate.getFullYear()} ${inputDate.getHours()}:`+minutes;
  }

  const handleInputChange = (event) => {
    setComment(event.target.value);
  }

  const handleSendCmt = async () => {
    if(user !== null){
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/comments",
      method: "post",
      data: {
        data:{
          description: comment,
          product: id,
          user: user?.user.id,
        }
      }
      });
      if(response.type === RESPONSE_TYPE){
        fetchData();
        setComment("");
        addToast("Bình luận thành công", {
          appearance: "success",
          autoDismiss: true
        });
      }
    }
    else{
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

  return (
    <div className={`description-review-area ${spaceBottomClass}`}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              {/* <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  Additional Information
                </Nav.Link>
              </Nav.Item> */}
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Mô tả</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">Bình luận({listComments.length})</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    <li>
                      <span>Weight</span> 400 g
                    </li>
                    <li>
                      <span>Dimensions</span>10 x 10 x 15 cm{" "}
                    </li>
                    <li>
                      <span>Materials</span> 60% cotton, 40% polyester
                    </li>
                    <li>
                      <span>Other Info</span> American heirloom jean shorts pug
                      seitan letterpress
                    </li>
                  </ul>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription">
                {productFullDesc}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="review">
                {listComments.slice(0, 5).map((row, index) => (
                  <div key={index}>
                   <div className="row">
                   <div className="col-lg-7">
                     <div className="review-wrapper">
                       <div className="single-review">
                         <div className="review-img">
                           <Avatar
                             src={
                               process.env.REACT_APP_SERVER_ENDPOINT + row.attributes.user.data?.attributes?.avatar?.data?.attributes?.url ?
                               process.env.REACT_APP_SERVER_ENDPOINT + row.attributes.user.data?.attributes?.avatar?.data?.attributes?.url : "abc"
                             }
                             alt=""
                             sx={{  mr: 1 }}
                           />
                         </div>
                         <div className="review-content">
                           <div className="review-top-wrap">
                             <div className="review-left">
                               <div className="review-name">
                                 <h4>{row.attributes.user.data?.attributes?.username}</h4>
                               </div>
                               {/* <div className="review-rating">
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                               </div> */}
                             </div>
                           </div>
                           <div className="review-date">
                             <p>
                               {formatDate(row.attributes.updatedAt)}
                             </p>
                           </div>
                           <div className="review-bottom">
                             <p>
                               {row.attributes.description}
                             </p>
                           </div>
                         </div>
                       </div>
                       {/* <div className="single-review child-review">
                         <div className="review-img">
                           <img
                             src={
                               process.env.PUBLIC_URL +
                               "/assets/img/testimonial/2.jpg"
                             }
                             alt=""
                           />
                         </div>
                         <div className="review-content">
                           <div className="review-top-wrap">
                             <div className="review-left">
                               <div className="review-name">
                                 <h4>White Lewis</h4>
                               </div>
                               <div className="review-rating">
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                                 <i className="fa fa-star" />
                               </div>
                             </div>
                           </div>
                           <div className="review-bottom">
                             <p>
                               Vestibulum ante ipsum primis aucibus orci
                               luctustrices posuere cubilia Curae Suspendisse
                               viverra ed viverra. Mauris ullarper euismod
                               vehicula. Phasellus quam nisi, congue id nulla.
                             </p>
                           </div>
                         </div>
                       </div> */}
                     </div>
                   </div>
                 </div>
                 <div className="dash"></div>
                 </div>
                ))}
                <div>
                  Bình Luận
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: "wrap", mt: 1}}>
                  <Avatar 
                    src= { urlAvatar }
                    alt=""
                    sx={{  mr: 1 }}
                  />
                  <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "950px"}}>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Hãy để lại một chút ý kiến của bạn khi mua sản phẩm này..."
                        inputProps={{ 'aria-label': 'search customer' }}
                        value={comment}
                        onChange={handleInputChange}
                    />
                    <SendIcon color="action" onClick={handleSendCmt} />
                  </Paper>
                </Box>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default ProductDescriptionTab;
