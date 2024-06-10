import { Avatar, Paper, Tooltip, Typography } from '@mui/material'
import React from 'react'

const CategoryItem = ({ name, image }) => {
  return (
    <Tooltip title={name}>
      <Paper
        sx={{
          border: "1px solid #ccc",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          height: "10rem",
          width: "100%",
          ":hover": {
            boxShadow: "0 0 8px #ccc"
          }
        }}
      >
        <Avatar variant='rounded' src={image} />

        <Typography width={"100%"} className='ellipsisText' textAlign={"center"}>{name}</Typography>
      </Paper>
    </Tooltip>
  )
}

export default CategoryItem