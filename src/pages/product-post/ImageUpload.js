import React from 'react'
import { useRef } from 'react';
import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const ImageUploadBoxStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "#f4f4f4",
  borderRadius: "8px",
  padding: "1rem",
  border: (theme) => "2px dashed " + theme.palette.primary.main
}
const ImageUpload = ({ productInfo, setProductInfo }) => {
  const inputFileRef = useRef();
  const inputFileAddRef = useRef();
  const handleUploadImages = (e) => {

    setProductInfo(prev => ({
      ...prev,
      images: Object.values(e.target.files)
    }));
  }
  const handleAddImage = (e) => {
    // setFiles(prev => [...prev, ...Object.values(e.target.files)]);
    setProductInfo(prev => ({
      ...prev,
      images: [...prev.images, ...Object.values(e.target.files)]
    }));
  }
  const handleRemoveImage = (index) => {
    // setFiles(prev => {
    //   return prev.filter((file, indexFile) => {
    //     return index !== indexFile
    //   });
    // });
    setProductInfo(prev => ({
      ...prev,
      images: prev.images.filter((file, indexFile) => {
        return index !== indexFile
      })
    }));
  };
  return (
    <>
      <input
        ref={inputFileAddRef}
        onChange={handleAddImage}
        hidden
        accept='image/*'
        type="file"
        multiple
      />
      <input
        ref={inputFileRef}
        onChange={handleUploadImages}
        hidden
        accept='image/*'
        type="file"
        multiple
      />
      <Box height="100%">
        {productInfo.images.length === 0 && <Box
          onClick={() => inputFileRef.current.click()}
          sx={{
            height: "100%",
            ...ImageUploadBoxStyle
          }}>
          <AddPhotoAlternateIcon
            sx={{
              color: (theme) => theme.palette.primary.main,
              height: "60px",
              width: "60px",
            }}
          />
          <Typography fontWeight={"bold"}> Đăng từ 4 đến 6 hình ảnh</Typography>
        </Box>}
        {productInfo.images.length > 0}
        {productInfo.images.length > 0 && <Grid container spacing={2}>
          <Grid item xs={3}>
            <Box
              onClick={() => inputFileAddRef.current.click()}
              sx={{
                height: "100%",
                ...ImageUploadBoxStyle
              }}>
              <AddIcon sx={{
                color: (theme) => theme.palette.primary.main,
                height: "40px",
                width: "40px",
              }} />
            </Box>
          </Grid>
          {productInfo.images.map((file, index) => {
            return <Grid item xs={3}>
              <Box sx={{ position: "relative" }}>
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    zIndex: 100,
                    position: "absolute",
                    top: 0,
                    right: 0,
                    transform: "translate(40%, -50%)",
                  }}>
                  <CloseIcon />
                </IconButton>
                <Avatar
                  src={URL.createObjectURL(file)}
                  variant="square"
                  sx={{
                    width: "80px", height: "80px",
                    border: "1px solid #ccc",
                    "& img": {
                      objectFit: "contain",
                      background: "#f7f7f7"
                    }
                  }}
                />
              </Box>
            </Grid>;
          })}
        </Grid>}
      </Box >
    </>
  )
}

export default ImageUpload