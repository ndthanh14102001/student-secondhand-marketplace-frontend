import { Box, TextField, Typography, Button } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { forgotPasswordApi } from '../../api/forgot-password-api';
import { RESPONSE_TYPE } from '../../utils/callApi';
import { useDispatch } from 'react-redux';
import { onShowPopupErrorBase } from '../../redux/actions/popupErrorBaseActions';
import { onOpenModalLoading, onCloseModalLoading } from '../../redux/actions/modalLoadingActions';

const PageForgotPassword = ({ email, setEmail }) => {
  const dispatch = useDispatch();
  const [isSuccessSendMail, setIsSuccessSendMail] = useState(false);
  const handleForgotPassword = async () => {
    dispatch(onOpenModalLoading());
    const response = await forgotPasswordApi.forgotPassword(email);
    if (response.type === RESPONSE_TYPE) {
      setIsSuccessSendMail(true);
    } else {
      dispatch(onShowPopupErrorBase(response));
    }
    dispatch(onCloseModalLoading());
  }
  return (
    <Box
      sx={{
        paddingTop: "100px",
        paddingBottom: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {!isSuccessSendMail ? <>
        <Typography fontSize={"2rem"} color="primary" mb="1rem">Quên mật khẩu</Typography>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            marginBottom: "1rem"
          }}
          label="Nhập email của bạn"
        />
        <Button variant="contained" onClick={handleForgotPassword} >Đồng ý</Button>
      </> :

        <Typography fontSize={"2rem"} mb="1rem">Hãy kiểm tra email của bạn</Typography>}

    </Box>
  )
}

export default PageForgotPassword