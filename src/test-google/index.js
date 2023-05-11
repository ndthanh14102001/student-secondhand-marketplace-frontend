import React, { useState } from 'react';

const DistanceCalculator = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');

  const calculateDistance = (origin, destination) => {
    const geocoder = new window.google.maps.Geocoder();
    let result = 0;
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
            console.log("distanceInKilometers", distanceInKilometers)
            result = distanceInKilometers.toFixed(2);
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
