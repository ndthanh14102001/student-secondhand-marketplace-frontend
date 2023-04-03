import PropTypes from "prop-types";
import React from "react";
import { setActiveSort } from "../../helpers/product";
import { useDispatch } from "react-redux";
import { setCategoryFilter } from "../../redux/actions/categoryActions";
const ChildsCategoires = ({ attributes }) => {
  const dispatch = useDispatch();
  let childCategories = attributes?.children?.data;
  const element = [];
  let level = 1;
  function handleClickCategory(e, childCategories) {
    dispatch(setCategoryFilter(childCategories));
    setActiveSort(e);
  }
  while (childCategories) {
    const cloneChild = childCategories;
    element.push(
      <li key={childCategories?.id} style={{ marginLeft: `calc(2rem * ${level})` }}>
        <div className="sidebar-widget-list-left">
          <button
            onClick={(e) => {
              handleClickCategory(e, cloneChild)
            }}
          >
            {" "}
            <span className="checkmark" /> {cloneChild?.attributes?.name}{" "}
          </button>
        </div>
      </li >)
    level++;
    childCategories = childCategories?.attributes?.children?.data;
  }
  return element;
}
const ShopCategories = ({ categories, getSortParams }) => {
  const dispatch = useDispatch();

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Danh mục </h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    // getSortParams("category", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Categories
                </button>
              </div>
            </li>
            {categories.map((category, key) => {
              const attributes = category?.attributes;
              return (
                <>
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        onClick={e => {
                          // getSortParams("category", category);
                          dispatch(setCategoryFilter(category));
                          setActiveSort(e);
                        }}
                      >
                        {" "}
                        <span className="checkmark" /> {attributes?.name}{" "}
                      </button>
                    </div>

                  </li>
                  <ChildsCategoires attributes={attributes} />
                </>
              );
            })}
          </ul>
        ) : (
          "No categories found"
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopCategories;
