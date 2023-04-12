import { InputLabel, Select, MenuItem, FormControl } from '@mui/material'
import React, { useLayoutEffect, useState } from 'react'
import { UNIVERSITY_LIST } from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { setUnversityFilter } from '../../redux/actions/filterActions'

export const ALL_UNIVERSITY = "Tất cả"
const ShopUniversityFilter = () => {
  const universityFilterValue = useSelector(state => state.filter.university);
  const dispatch = useDispatch();
  
  useLayoutEffect(() => {
    dispatch(setUnversityFilter(ALL_UNIVERSITY))
  }, [dispatch])
  return (
    <FormControl fullWidth sx={{ marginBottom: "1rem" }} >
      <InputLabel id="university-select-label">Trường đại học</InputLabel>
      <Select
        MenuProps={{
          disableScrollLock: true
        }}
        labelId="university-select-label"
        id="university-select"
        value={universityFilterValue}
        label="Trường đại học"
        onChange={(e) => dispatch(setUnversityFilter(e.target.value))}
      >
        <MenuItem value={ALL_UNIVERSITY}>{ALL_UNIVERSITY}</MenuItem>
        {UNIVERSITY_LIST.map((university, index) => {
          return <MenuItem key={index} value={university}>{university}</MenuItem>
        })}
      </Select>

    </FormControl>
  )
}

export default ShopUniversityFilter