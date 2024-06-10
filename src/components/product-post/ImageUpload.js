import React from "react";

import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import useImageUploadHook from "../../hooks/product-post/ImageUploadHook";

const ImageUploadBoxStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: "#f4f4f4",
  borderRadius: "8px",
  padding: "1rem",
  border: (theme) => "2px dashed " + theme.palette.primary.main,
};

const ImageUpload = ({ productInfo, setProductInfo }) => {
  const imageUploadHook = useImageUploadHook({ setProductInfo });
  return (
    <>
      <input
        key={imageUploadHook.flagToClearInput || ""}
        ref={imageUploadHook.inputFileAddRef}
        onChange={imageUploadHook.addImage}
        hidden
        accept="image/*"
        type="file"
        multiple
      />
      <input
        key={imageUploadHook.flagToClearInput || ""}
        ref={imageUploadHook.inputFileRef}
        onChange={imageUploadHook.uploadImages}
        hidden
        accept="image/*"
        type="file"
        multiple
      />
      <Box height="100%">
        {productInfo.images?.length === 0 && (
          <Box
            onClick={() => imageUploadHook.inputFileRef.current.click()}
            sx={{
              height: "100%",
              ...ImageUploadBoxStyle,
            }}
          >
            <AddPhotoAlternateIcon
              sx={{
                color: (theme) => theme.palette.primary.main,
                height: "60px",
                width: "60px",
              }}
            />
            <Typography fontWeight={"bold"}>
              {" "}
              Đăng từ 4 đến 6 hình ảnh
            </Typography>
          </Box>
        )}
        {productInfo.images?.length > 0}
        {productInfo.images?.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box
                onClick={() => imageUploadHook.inputFileAddRef.current.click()}
                sx={{
                  height: "100%",
                  ...ImageUploadBoxStyle,
                }}
              >
                <AddIcon
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    height: "40px",
                    width: "40px",
                  }}
                />
              </Box>
            </Grid>
            {productInfo.images?.map((file, index) => {
              return (
                <Grid item xs={3}>
                  <Box sx={{ position: "relative" }}>
                    <IconButton
                      onClick={() => imageUploadHook.removeImage(index)}
                      sx={{
                        zIndex: 100,
                        position: "absolute",
                        top: 0,
                        right: 0,
                        transform: "translate(40%, -50%)",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Avatar
                      src={imageUploadHook.showImage(file)}
                      variant="square"
                      sx={{
                        width: "80px",
                        height: "80px",
                        border: "1px solid #ccc",
                        "& img": {
                          objectFit: "contain",
                          background: "#f7f7f7",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default ImageUpload;
