import PropTypes from "prop-types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { setActiveSort } from "../../helpers/product";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryFilter } from "../../redux/actions/filterActions";
// const ChildsCategoires = ({ attributes }) => {
//   const dispatch = useDispatch();
//   let childCategories = attributes?.children?.data;
//   console.log("childCategories", childCategories)
//   const element = [];
//   let level = 1;
//   function handleClickCategory(e, childCategories) {
//     dispatch(setCategoryFilter(childCategories));
//     setActiveSort(e);
//   }

//   while (childCategories) {
//     const cloneChild = childCategories;
//     element.push(
//       <li key={childCategories?.id} style={{ marginLeft: `calc(2rem * ${level})` }}>
//         <div className="sidebar-widget-list-left">
//           <button
//             onClick={(e) => {
//               handleClickCategory(e, cloneChild)
//             }}
//           >
//             {" "}
//             <span className="checkmark" /> {cloneChild?.attributes?.name}{" "}
//           </button>
//         </div>
//       </li >)
//     level++;
//     childCategories = childCategories?.attributes?.children?.data;
//   }
//   return element;
// }
export const ALL_CATEGORY = "All Category"
const ShopCategories = ({ categories, getSortParams }) => {
  const dispatch = useDispatch();
  const categoriesFilter = useSelector(state => state.filter.category);
  const checkboxCategoryRef = useRef();
  const [firstLoad, setFirsLoad] = useState(true);
  useEffect(() => {
    if (checkboxCategoryRef.current?.click) {
      checkboxCategoryRef.current.click();
    }
  }, [firstLoad]);
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Danh mục </h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li key={ALL_CATEGORY}>
              <div className="sidebar-widget-list-left">
                <button
                  ref={categoriesFilter === ALL_CATEGORY ? checkboxCategoryRef : null}
                  onClick={e => {
                    // getSortParams("category", "");
                    dispatch(setCategoryFilter(ALL_CATEGORY));
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> Tất cả
                </button>
              </div>
            </li>
            {categories.map((category, key) => {
              const attributes = category?.attributes;
              const childsCategories = attributes?.children?.data;
              if (categoriesFilter?.id === category?.id && firstLoad) {
                setFirsLoad(false)
              }
              return (
                <>
                  <li key={key}>
                    <div className="sidebar-widget-list-left">
                      <button
                        ref={categoriesFilter?.id === category?.id ? checkboxCategoryRef : null}
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
                  {/* <ChildsCategoires attributes={attributes} /> */}
                  {childsCategories && childsCategories.map((child) => {
                    if (categoriesFilter?.id === child?.id && firstLoad) {
                      setFirsLoad(false)
                    }
                    return <li key={child?.id} style={{ marginLeft: "2rem" }}>
                      <div className="sidebar-widget-list-left">
                        <button
                          ref={categoriesFilter?.id === child?.id ? checkboxCategoryRef : null}
                          onClick={(e) => {
                            dispatch(setCategoryFilter(child));
                            setActiveSort(e);
                          }}
                        >
                          {" "}
                          <span className="checkmark" /> {child?.attributes?.name}{" "}
                        </button>
                      </div>
                    </li >
                  })}
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
