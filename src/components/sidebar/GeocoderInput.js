import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useEffect } from 'react';
import { useValue } from '../../context/ContextProvider';

const ctrl = new MapboxGeocoder({
  marker: false,
  accessToken: process.env.REACT_APP_MAP_TOKEN,
});

const GeocoderInput = () => {
  const { mapRef, containerRef, dispatch } = useValue();

  useEffect(() => {
    if (!containerRef?.current) {
      return;
    }

    // Remove existing children from container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Add MapboxGeocoder to container
    containerRef.current.appendChild(ctrl.onAdd(mapRef.current.getMap()));

    // Event listener for result
    const handleResult = (e) => {
      const coords = e.result.geometry.coordinates;
      dispatch({
        type: 'FILTER_ADDRESS',
        payload: { lng: coords[0], lat: coords[1] },
      });
    };

    // Event listener for clear
    const handleClear = () => {
      dispatch({ type: 'CLEAR_ADDRESS' });
    };

    // Attach event listeners
    ctrl.on('result', handleResult);
    ctrl.on('clear', handleClear);

    // Cleanup event listeners on component unmount
    return () => {
      ctrl.off('result', handleResult);
      ctrl.off('clear', handleClear);
    };
  }, [containerRef, dispatch, mapRef]);

  return null;
};


export default GeocoderInput;
