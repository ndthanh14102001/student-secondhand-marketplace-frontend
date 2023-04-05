import { Avatar, Box, Button, Typography } from '@mui/material'
import palette from '../../assets/palette'
import React from 'react'
import { Link } from 'react-router-dom'
import { ddmmyy } from '../../utils/DateFormat'

const ProductOwnerInfo = ({ user }) => {
  return (
    <Box
      className="product-onwer-info"
      display={"flex"}
    >
      <Avatar
        sx={{ width: 100, height: 100 }}
        variant="rounded"
        alt={user?.name}
        src={process.env.REACT_APP_SERVER_ENDPOINT + user?.avatar?.data?.attributes?.url}
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
          {user?.fullName}
        </Link>
        <Box display={"flex"}>
          <p>Ngày tham gia :</p>
          <Typography
            component="span"
            fontWeight="bold"
            marginLeft={"0.4rem"}
          >{ddmmyy(new Date(user?.createdAt))}</Typography>
        </Box>
        <Box display={"flex"}>
          <p>Sản phẩm :</p>
          <Typography component="span"
            fontWeight="bold"
            marginLeft={"0.4rem"}>{user?.product?.data?.length || 0}</Typography>
        </Box>

        <Box display={"flex"}>
          <p>Vị trí :</p>
          <Typography component="span"
            fontWeight="bold"
            marginLeft={"0.4rem"}>{user?.university || ""}</Typography>
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