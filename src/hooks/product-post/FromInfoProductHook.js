import { useEffect, useState } from "react";
import validator from "validator";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
const useFromInfoProductHook = ({ setProductInfo }) => {
  const [categories, setCategories] = useState([]);

  const handleChangePrice = (e) => {
    if (validator.isNumeric(e.target.value)) {
      setProductInfo((prev) => ({
        ...prev,
        price: e.target.value,
      }));
    }
  };
  useEffect(() => {
    const getAllCategory = async () => {
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/categories",
        method: "get",
        params: {
          filters: {
            parent: {
              id: {
                $null: true,
              },
            },
          },
          populate: {
            children: {
              populate: "children",
            },
          },
          sort: {
            name: "desc",
          },
        },
      });
      if (response.type === RESPONSE_TYPE) {
        setCategories(response.data?.data);
      }
    };
    getAllCategory();
  }, []);
  return { categories, setCategories, handleChangePrice };
};

export default useFromInfoProductHook;
