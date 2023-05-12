import unversity from "../../data/university.json";
import unversityArray from "../../data/universityArray.json";
import wards from "../../data/phuong_xa.json";
import district from "../../data/quan_huyen.json";
import city from "../../data/tinh_thanhpho.json";
import distanceUniversity from "../../data/distance-university-data-array.json";
import distanceUniversityObject from "../../data/distance-university-data-object.json";

export const getUniversityById = (id) => {
  return unversity[id];
};

export const getAllUniversity = () => {
  return unversity;
};
export const getArrayUniversity = () => {
  return unversityArray;
};
export const getFullAddressUniversity = (university) => {
  return `${university.teN_DON_VI},${university.diA_CHI},${wards[university.xA_PHUONG_ID]},${district[university.quaN_HUYEN_ID]},${city[university.tinH_THANH_ID]}`
}
export const getAllDistanceUniversity= () => {
  return distanceUniversity
}
export const getAllDistanceUniversityObject= () => {
  return distanceUniversityObject
}