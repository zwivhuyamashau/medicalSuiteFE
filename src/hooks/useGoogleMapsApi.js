import { useState } from 'react';

const useGoogleMapsApi = () => {
  // Since we're not using the Google Maps JavaScript API directly anymore,
  // we just return that everything is loaded
  return {
    isLoaded: true,
    loadError: null
  };
};

export default useGoogleMapsApi;
