import React, { useState, useEffect } from 'react';
import { getArrayUniversity, getAllUniversity, getFullAddressUniversity } from '../utils/data/university';
import { getUserLogin } from '../utils/userLoginStorage';
import { calculateDistance } from '../utils/googleApi';
import fs from "fs";
const DistanceCalculator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const universityArray = getArrayUniversity();
  const universityObject = getAllUniversity();
  const userLogin = getUserLogin();

  useEffect(() => {
    const getDistance = async () => {
      let distances = {}
      for (let indexUniversityOrigin = 0; indexUniversityOrigin < universityArray.length; indexUniversityOrigin++) {
        const universityOrigin = universityArray[indexUniversityOrigin];
        console.log("1");
        let distancestp = {}
        for (let indexUniversityDes = 0; indexUniversityDes < universityArray.length; indexUniversityDes++) {
          const universityDes = universityArray[indexUniversityDes];
          console.log("2");
          const originAddress = getFullAddressUniversity(universityOrigin);
          const destinationAddress = getFullAddressUniversity(universityDes);
          const result = await calculateDistance(
            originAddress,
            destinationAddress,
          );
          distancestp = {
            ...distancestp,
            [universityDes.id]: result
          };
        }
        distances[universityOrigin.id] = distancestp
      }

      distances = JSON.stringify(distances, null, 2);
      const filename = 'distance-university-data.json';

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(distances));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsLoading(false);
    }
    getDistance();
  }, []);


  return (
    <div>
      {isLoading && "loading..."}
      {!isLoading && "get distance success"}
    </div>
  );
};

export default DistanceCalculator;
