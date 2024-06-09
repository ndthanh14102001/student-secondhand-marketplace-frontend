import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";
import TextEditor from "../../../components/TextEditor";
import ProductInfoInput from "../../../components/product-post/ProductInfoInput";
import useFromInfoProductHook from "../../../hooks/product-post/FromInfoProductHook";

const renderCategorySelectGroup = (category) => {
  const attributesCategory = category?.attributes;
  const childs = attributesCategory?.children?.data;
  const childItems = childs?.map((child) => {
    const attributesChild = child?.attributes;
    return (
      <MenuItem sx={{ marginLeft: "1rem" }} value={child?.id} key={child?.id}>
        {attributesChild?.name}
      </MenuItem>
    );
  });
  return [
    <ListSubheader>{attributesCategory?.name}</ListSubheader>,
    childItems,
  ];
};
const ActionStyles = {
  flex: 1,
};

const FormInfoProduct = ({ productInfo, setProductInfo }) => {
  const fromInfoProductHook = useFromInfoProductHook({ setProductInfo });
  return (
    <Box>
      <ProductInfoInput
        error={!productInfo.isValidName}
        helperText={
          !productInfo.isValidName && "Tên sản phẩm phải lớn hơn 6 chữ"
        }
        value={productInfo.name}
        label="Tên sản phẩm"
        required
        onChange={(e) =>
          setProductInfo((prev) => ({
            ...prev,
            name: e.target.value,
            isValidName: true,
          }))
        }
      />
      <ProductInfoInput
        required
        value={productInfo.price}
        onChange={fromInfoProductHook.handleChangePrice}
        label="Giá"
      />
      <FormControl
        error={!productInfo.isValidCategoryChoose}
        required
        sx={{
          marginBottom: "1rem",
        }}
        fullWidth
      >
        <InputLabel htmlFor="category-select">Danh mục</InputLabel>
        <Select
          id="category-select"
          label="Danh mục"
          onChange={(e) => {
            setProductInfo((prev) => ({
              ...prev,
              categoryChoose: e.target.value,
              isValidCategoryChoose: true,
            }));
          }}
          value={productInfo.categoryChoose}
        >
          {fromInfoProductHook.categories &&
            fromInfoProductHook.categories?.map((category) => {
              return renderCategorySelectGroup(category);
            })}
        </Select>
        {!productInfo.isValidCategoryChoose && (
          <FormHelperText>Hãy chọn danh mục </FormHelperText>
        )}
      </FormControl>

      <Box>
        <TextEditor
          value={productInfo.description}
          setValue={(value) => {
            setProductInfo((prev) => ({
              ...prev,
              description: value,
              isValidDescription: true,
            }));
          }}
          placeholder="Enter your text here"
          toolbarTextHoverColor="#000000"
          toolbarBackgroundColor="#D3D3D3"
          contentEditorBackgroundColor="#FFFFFF"
          contentEditorTextColor="#000000"
        />
        {!productInfo?.isValidDescription && (
          <FormHelperText error>
            Mô tả phải lớn hơn hoặc bằng 10 từ
          </FormHelperText>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <Button
          variant="outlined"
          sx={{ ...ActionStyles, marginRight: "1rem" }}
          type="button"
        >
          Xem trước
        </Button>
        <Button variant="contained" sx={ActionStyles} type="submit">
          Đăng bán
        </Button>
      </Box>
    </Box>
  );
};

export default FormInfoProduct;
