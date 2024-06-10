import React from "react";
import {
  Stack,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

import { ddmmyy } from "../../utils/DateFormat";

import { getUniversityById } from "../../utils/data/university";
import InfoItem from "../../components/user-info/InfoItem";
const UserInfomation = ({userInfo}) => {
  return (
    <Stack direction={"column"} spacing={1}>
      <InfoItem
        icon={<CalendarMonthIcon />}
        label={"Ngày tham gia"}
        info={ddmmyy(new Date(userInfo?.createdAt))}
      />
      <InfoItem
        icon={<SchoolIcon />}
        label={"Trường đại học"}
        info={
          getUniversityById(userInfo?.universityId)?.teN_DON_VI
        }
      />
      <InfoItem
        icon={<LocationOnIcon />}
        label={"Địa chỉ nhà"}
        info={userInfo?.address}
      />
      <InfoItem
        icon={<PhoneIcon />}
        label={"Số điện thoại"}
        info={userInfo?.phone}
      />
    </Stack>
  );
};

export default UserInfomation;
