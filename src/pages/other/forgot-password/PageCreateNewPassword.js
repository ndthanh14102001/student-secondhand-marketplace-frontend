import React, { useRef } from 'react'
import { useMemo } from 'react';
import { Box, TextField, Typography, Button, styled, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ERROR_COLOR, getColorToPasswordStrength } from '../../../components/PasswordStrengthBar/constants';

import PasswordStrengthBar from '../../../components/PasswordStrengthBar';
import { forgotPasswordApi } from '../../../api/forgot-password-api';
import { RESPONSE_TYPE } from '../../../utils/callApi';
import { useDispatch } from 'react-redux';
import { onShowPopupErrorBase } from '../../../redux/actions/popupErrorBaseActions';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import { onCloseModalLoading, onOpenModalLoading } from '../../../redux/actions/modalLoadingActions';
const BoxInput = styled(Box)(() => ({
  marginBottom: "1rem",
  width: "500px"
}));

const PageCreateNewPassword = ({ code, infoCreateNewPassword, setInfoCreateNewPassword }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const colorValidStrengthPassword = useMemo(() => {
    if (infoCreateNewPassword.password?.length > 0) {
      return getColorToPasswordStrength(infoCreateNewPassword.password);
    }
    return "primary";
  }, [infoCreateNewPassword.password]);
  const refPasswordInput = useRef();
  const handleChangePasswordRegister = e => {
    let isValidConfirmPassword = false;
    if (e.target.value === infoCreateNewPassword.confirmPassword) {
      isValidConfirmPassword = true;
    }
    setInfoCreateNewPassword({
      ...infoCreateNewPassword,
      password: e.target.value,
      isValidConfirmPassword
    })
  }
  const handleChangeConfirmPassword = e => {
    let isValidConfirmPassword = false;
    if (e.target.value === infoCreateNewPassword.password) {
      isValidConfirmPassword = true;
    }
    setInfoCreateNewPassword({
      ...infoCreateNewPassword,
      confirmPassword: e.target.value,
      isValidConfirmPassword
    })
  }
  const handleClickShowPassword = () => {
    setInfoCreateNewPassword({
      ...infoCreateNewPassword,
      isShowPassword: !infoCreateNewPassword.isShowPassword
    })
  }
  const checkValidInputRegister = () => {
    let result = true;
    if (infoCreateNewPassword.password !== infoCreateNewPassword.confirmPassword) {
      result = false;
      setInfoCreateNewPassword(prev => ({
        ...prev,
        isValidConfirmPassword: false
      }))
    }
    if (getColorToPasswordStrength(infoCreateNewPassword.password) === ERROR_COLOR) {
      result = false;
      refPasswordInput.current.querySelector("input").focus();
    }
    return result;
  }
  const handleCreateNewPassword = async () => {
    if (checkValidInputRegister()) {
      dispatch(onOpenModalLoading());
      const response = await forgotPasswordApi.creatNewPassword(code, infoCreateNewPassword.password, infoCreateNewPassword.confirmPassword);
      if (response.type === RESPONSE_TYPE) {
        addToast("Đổi mật khẩu thành công", {
          appearance: "success",
          autoDismiss: true
        });
        history.push(process.env.PUBLIC_URL + "/login-register")
      } else {
        dispatch(onShowPopupErrorBase(response));
      }
      dispatch(onCloseModalLoading());
    }

  }
  return (
    <Box
      sx={{
        paddingTop: "100px",
        paddingBottom: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
      }}
    >
      <Typography fontSize={"2rem"} color="primary" mb="1rem">Tạo mật khẩu</Typography>
      <BoxInput>
        <TextField
          ref={refPasswordInput}
          color={colorValidStrengthPassword}
          helperText={(
            "Sử dụng 6+ ký tự, kết hợp với chữ thường, chữ hoa, số, ký tự đặt biệt"
          )}
          required
          fullWidth
          type={infoCreateNewPassword.isShowPassword ? "text" : "password"}
          name="user-password"
          placeholder="Mật khẩu mới"
          label="Mật khẩu"
          value={infoCreateNewPassword.password}
          onChange={handleChangePasswordRegister}
          InputProps={
            {
              endAdornment: <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {infoCreateNewPassword.isShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          }
        />
      </BoxInput>
      <BoxInput>
        <PasswordStrengthBar value={infoCreateNewPassword.password} />
      </BoxInput>
      <BoxInput mt={"1rem"}>
        <TextField
          error={!infoCreateNewPassword.isValidConfirmPassword}
          helperText={!infoCreateNewPassword.isValidConfirmPassword && "Mật khẩu và Xác nhận mật khẩu không giống nhau"}
          fullWidth
          required
          type={infoCreateNewPassword.isShowPassword ? "text" : "password"}
          name="user-confirm-password"
          placeholder="Xác nhận mật khẩu"
          label="Xác nhận mật khẩu"
          value={infoCreateNewPassword.confirmPassword}
          onChange={handleChangeConfirmPassword}
          InputProps={
            {
              endAdornment: <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {infoCreateNewPassword.isShowPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          }
        />
      </BoxInput>
      <Button variant="contained" onClick={handleCreateNewPassword}>Đồng ý</Button>
    </Box>
  )
}

export default PageCreateNewPassword