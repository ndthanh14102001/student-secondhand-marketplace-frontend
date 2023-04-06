import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import validator from 'validator';
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
export function MyListSubheader(
  props
) {
  const { muiSkipListHighlight, ...other } = props;
  return <ListSubheader {...other} />;
}
const renderSelectGroup = category => {
  const attributesCategory = category?.attributes;
  const childs = attributesCategory?.children?.data;
  const childItems = childs.map(child => {
    const attributesChild = child?.attributes;
    return <MenuItem
      sx={{ marginLeft: "1rem" }}
      value={child?.id}
      key={child?.id}
    >
      {attributesChild?.name}
    </MenuItem>
  });
  return [<ListSubheader>{attributesCategory?.name}</ListSubheader>, childItems];
};
const ActionStyles = {
  flex: 1
}

const InputProductInfo = (props) => {
  return (
    <Box
      sx={{
        marginBottom: "1rem"
      }}
    >
      <TextField
        sx={{
          "& textarea": {
            border: "none"
          }
        }}
        fullWidth
        {...props}
      />
    </Box>
  );
};
const FormInfoProduct = ({ categoryChoose, setCategoryChoose, price, setPrice }) => {

  const [categories, setCategories] = useState([]);

  console.log("categoryChoose", categoryChoose)
  const handleChangePrice = (e) => {
    if (validator.isNumeric(e.target.value)) {
      setPrice(e.target.value)
    }
  };
  useEffect(() => {
    const getAllCategory = async () => {
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/categories",
        method: "get",
        params: {
          filters: {
            parent: {
              id: {
                $null: true
              }
            }
          },
          populate: {
            children: {
              populate: "children"
            },
          },
          sort: {
            name: "desc"
          }
        }
      });
      if (response.type === RESPONSE_TYPE) {
        setCategories(response.data?.data);
      }
    }
    getAllCategory();
  }, []);

  return (
    <Box >
      <InputProductInfo label="Tên sản phẩm" required />
      <InputProductInfo
        required
        value={price}
        onChange={handleChangePrice}
        label="Giá"
      />
      <FormControl required sx={{
        marginBottom: "1rem"
      }} fullWidth>
        <InputLabel htmlFor="category-select">Danh mục</InputLabel>
        <Select
          id="category-select"
          label="Danh mục"
          onChange={(e) => {
            setCategoryChoose(e.target.value)
          }}
          value={categoryChoose}
        >
          {categories && categories.map((category) => {
            return renderSelectGroup(category);
          })}
        </Select>
      </FormControl>

      <InputProductInfo required label="Mô tả" multiline rows={4} />
      <Box sx={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <Button variant='outlined' sx={{ ...ActionStyles, marginRight: "1rem" }} type="button">Xem trước</Button>
        <Button variant='contained' sx={ActionStyles} type="submit" >Đăng bán</Button>
      </Box>
    </Box >
  )
}

export default FormInfoProduct