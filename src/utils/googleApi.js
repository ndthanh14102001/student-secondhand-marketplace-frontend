export const calculateDistance = (origin, destination) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
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
            resolve(distanceInKilometers.toFixed(2))
          } else {
            reject(status);
          }
        });
      } else {
        reject(status);
      }
    });
  });


};