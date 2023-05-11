import { Autocomplete, TextField } from '@mui/material'
import React, { useLayoutEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setUnversityFilter } from '../../redux/actions/filterActions';
import { getAllUniversity } from "../../utils/data/university";

export const ALL_UNIVERSITY = "Tất cả"
const ShopUniversityFilter = () => {
  // const universityFilterValue = useSelector(state => state.filter.university);
  const university = useMemo(() => {
    return Object.values(getAllUniversity());
  }, []);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setUnversityFilter(ALL_UNIVERSITY))
  }, [dispatch])
  const handleChangeUniversity = (e, newValue) => {
    if (newValue) {
      dispatch(setUnversityFilter(newValue.id))
    } else {
      dispatch(setUnversityFilter(ALL_UNIVERSITY))
    }
  }
  return (
    <Autocomplete
      onChange={handleChangeUniversity}
      disablePortal
      id="combo-box-demo"
      options={university}
      sx={{ mb: "1rem" }}
      renderInput={(params) => <TextField {...params} label="Trường Đại Học" />}
      getOptionLabel={(university) => university?.teN_DON_VI}
    />
  )
}

export default ShopUniversityFilter