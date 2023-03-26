import { Box, Typography } from '@mui/material'
import React from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useRef } from 'react';

const ImageUpload = () => {
  const inputFileRef = useRef();
  return (
    <Box>
      <Box
        onClick={() => inputFileRef.current.click()}
        sx={{
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "1rem",
          border: (theme) => "2px dashed " + theme.palette.primary.main
        }}>
        <input ref={inputFileRef} hidden accept='image/*' type="file" />
        <AddPhotoAlternateIcon
          sx={{
            color: (theme) => theme.palette.primary.main,
            height: "60px",
            width: "60px",
          }}
        />
        <Typography fontWeight={"bold"}> Đăng từ 1 đến 6 hình ảnh</Typography>
      </Box>
    </Box >
  )
}

export default ImageUpload