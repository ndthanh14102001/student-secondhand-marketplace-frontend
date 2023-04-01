import { Avatar, Paper, Typography } from '@mui/material'
import React from 'react'

const CategoryItem = ({ name, image }) => {
  return (
    <Paper
      sx={{
        border: "1px solid #ccc",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        margin: "1rem",
        height: "100px"
      }}
    >
      <Avatar variant='rounded' src={image} />
      <Typography>{name}</Typography>
    </Paper>
  )
}

export default CategoryItem