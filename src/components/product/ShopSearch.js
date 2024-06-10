import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setNameFilter } from "../../redux/actions/filterActions";
const ShopSearch = () => {
  const dispatch = useDispatch();
  const nameFilter = useSelector((state) => state.filter.name);
  const [searchValue, setSearchValue] = useState(nameFilter);
  const handleClickSearch = () => {
    dispatch(setNameFilter(searchValue.trim()));
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleClickSearch();
    }
  };
  return (
    <Box className="mb-20">
      <TextField
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        fullWidth
        label="Tìm kiếm..."
        onKeyUp={handleKeyUp}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickSearch} edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ShopSearch;
