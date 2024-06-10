import React, { useState } from "react";

const MobileSearch = ({ handleSearch }) => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="offcanvas-mobile-search-area">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch(searchValue);
        }}
      >
        <input
          type="search"
          placeholder="Tìm kiếm ..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <button type="submit">
          <i className="fa fa-search" />
        </button>
      </form>
    </div>
  );
};

export default MobileSearch;
