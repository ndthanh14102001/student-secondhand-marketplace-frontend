import PropTypes from "prop-types";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
import { useEffect } from "react";
import { getUserLogin } from "../../utils/userLoginStorage";
import callApi, { RESPONSE_TYPE,STATUS_BAD_REQUEST } from "../../utils/callApi";
import Avatar from '@mui/material/Avatar';

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, id }) => {

  const user = getUserLogin();

  const [listComments, setListComments] = useState([]);
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
  }, []);

  const formatDate = (date) => {
    const inputDate = new Date(date);
    return `${inputDate.getDate().toString().padStart(2, '0')}-${(inputDate.getMonth() + 1).toString().padStart(2, '0')}-${inputDate.getFullYear()}`;
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
                <Nav.Link eventKey="productReviews">Bình luận(2)</Nav.Link>
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
                {listComments.slice(0, 5).map((row) => (
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
                                 <h4>{row.attributes.user.data.attributes.username}</h4>
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
                ))}
                <div className="col-lg-5">
                     <div className="ratting-form-wrapper pl-50">
                       <h3>Add a Review</h3>
                       <div className="ratting-form">
                         <form action="#">
                           <div className="star-box">
                             <span>Your rating:</span>
                             <div className="ratting-star">
                               <i className="fa fa-star" />
                               <i className="fa fa-star" />
                               <i className="fa fa-star" />
                               <i className="fa fa-star" />
                               <i className="fa fa-star" />
                             </div>
                           </div>
                           <div className="row">
                             <div className="col-md-6">
                               <div className="rating-form-style mb-10">
                                 <input placeholder="Name" type="text" />
                               </div>
                             </div>
                             <div className="col-md-6">
                               <div className="rating-form-style mb-10">
                                 <input placeholder="Email" type="email" />
                               </div>
                             </div>
                             <div className="col-md-12">
                               <div className="rating-form-style form-submit">
                                 <textarea
                                   name="Your Review"
                                   placeholder="Message"
                                   defaultValue={""}
                                 />
                                 <input type="submit" defaultValue="Submit" />
                               </div>
                             </div>
                           </div>
                         </form>
                       </div>
                     </div>
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
