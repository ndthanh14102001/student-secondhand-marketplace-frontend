import { Avatar, Box, Button, Typography } from '@mui/material'
import palette from '../../assets/palette'
import React from 'react'
import { Link } from 'react-router-dom'
import { fontWeight } from '@mui/system'

const ProductOwnerInfo = () => {
  return (
    <Box
      className="product-onwer-info"
      display={"flex"}
    >
      <Avatar
        sx={{ width: 100, height: 100 }}
        variant="rounded"
        alt="avatar"
        src="/static/images/avatar/1.jpg"
      />
      <Box
        ml="1rem"
        display={"flex"}
        flexDirection="column"
        justifyContent={"space-between"}
      >
        <Link
          to="/my-account"
          style={{
            color: palette.primary.main,
            fontWeight: "bold"
          }}
        >
          Tên người bán
        </Link>
        <Box display={"flex"}>
          <p>Ngày tham gia :</p>
          <Typography
            component="span"
            fontWeight="bold"
            marginLeft={"0.4rem"}
          >10/10/2001</Typography>
        </Box>
        <Box display={"flex"}>
          <p>Sản phẩm :</p>
          <Typography component="span"
            fontWeight="bold"
            marginLeft={"0.4rem"}>10</Typography>
        </Box>

        <Box display={"flex"}>
          <p>Số lượt thích :</p>
          <Typography component="span"
            fontWeight="bold"
            marginLeft={"0.4rem"}>10</Typography>
        </Box>
      </Box>
      <Box
        ml={"1rem"}
        display={"flex"}
        alignItems="center"
      >
        <Button disabled variant="contained">Theo dõi</Button>
      </Box>
    </Box>
  )
}

export default ProductOwnerInfo