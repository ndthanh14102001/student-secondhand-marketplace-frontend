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
import React, { useState } from 'react'
import validator from 'validator';
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
const FormInfoProduct = () => {
  const [price, setPrice] = useState(0);
  const handleChangePrice = (e) => {
    if (validator.isNumeric(e.target.value)) {
      setPrice(e.target.value)
    }
  };
  return (
    <Box>
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
        <Select defaultValue="" id="category-select" label="Danh mục">
          <ListSubheader>Danh mục 1</ListSubheader>
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <ListSubheader>Danh mục 2</ListSubheader>
          <MenuItem value={3}>Option 3</MenuItem>
          <MenuItem value={4}>Option 4</MenuItem>
        </Select>
      </FormControl>
      <InputProductInfo required label="Mô tả" multiline rows={4} />
      <Box sx={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <Button variant='outlined' sx={{ ...ActionStyles, marginRight: "1rem" }}>Xem trước</Button>
        <Button variant='contained' sx={ActionStyles} >Đăng bán</Button>
      </Box>
    </Box>
  )
}

export default FormInfoProduct