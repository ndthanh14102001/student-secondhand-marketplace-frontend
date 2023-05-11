import unversity from "../../data/university.json";

export const getUniversityById = (id) => {
  return unversity[id];
};

export const getAllUniversity = () => {
  return unversity;
};