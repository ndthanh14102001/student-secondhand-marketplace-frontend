import React from "react";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";
import MyProductGrid from "./MyProductGrid";
import { PRODUCT_ON_SALE_KEY } from "../../constants/my-products/constants";
import { Box } from "@mui/material";

const ProductPostList = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      className="row"
      role="tabpanel"
      hidden={value !== index}
      id={`products-tabpanel-${index}`}
      aria-labelledby={`products-tab-${index}`}
      sx={{
        padding: {
          xs: 2,
          md: 0,
        },
      }}
      {...other}
    >
      <MyProductGrid
        productStatus={value}
        category={value === PRODUCT_ON_SALE_KEY ? "fashion" : "men"}
        type="bestSeller"
        limit={8}
        spaceBottomClass="mb-25"
      />
    </Box>
  );
};

export default ProductPostList;
