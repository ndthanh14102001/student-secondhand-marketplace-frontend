import React, { useState } from 'react';
let array = [];
const DistanceCalculator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  console.log("array", array);

  const calculateDistance = (origin, destination, getValue) => {
    const geocoder = new window.google.maps.Geocoder();
    const result = 0;
    geocoder.geocode({ address: origin }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        const originLatLng = results[0].geometry.location;

        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            const destinationLatLng = results[0].geometry.location;
            const distanceInMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
              originLatLng,
              destinationLatLng
            );
            const distanceInKilometers = distanceInMeters / 1000;

            forceUpdate(distanceInKilometers);
          } else {
            alert('Destination geocode was not successful for the following reason: ' + status);
          }
        });
      } else {
        alert('Origin geocode was not successful for the following reason: ' + status);
      }
    });
    return result;
  };
  const forceUpdate = (value) => {
    console.log('Distance:', value);
    array.push(value);
    return value;
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={() => setDistance(calculateDistance(origin, destination))}>Calculate Distance</button>
      {distance && <p>Distance: {distance} kilometers</p>}
    </div>
  );
};

export default DistanceCalculator;
