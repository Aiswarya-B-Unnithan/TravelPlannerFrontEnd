import React, { useEffect, useState } from "react";
import { useValue } from "../context/ContextProvider";
import ReactMapGL, { GeolocateControl, Marker, NavigationControl, Popup } from "react-map-gl";
import Supercluster from "supercluster";
import { Avatar, Paper, Tooltip } from "@mui/material";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Geocoder from "./hostComponents/addRoom/addLocation/Geocoder";

const supercluster = new Supercluster({
  radius: 75,
  maxZoom: 20,
});

const FindFriendsMap = () => {
  const {
    state: { currentUser },
    mapRef,
    dispatch,
  } = useValue();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiRequest({
          url: "/users/all", // Replace with the actual endpoint for fetching all users
          token: user?.token,
          method: "GET",
        });

        setUsers(response?.data);
    
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

 
  const [points, setPoints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [bounds, setBounds] = useState([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(0);
  const [popupInfo, setPopupInfo] = useState(null);

  const redirectToUserPage = (userId) => {
    
    navigate(`/profile/${userId}`);
  };
  useEffect(() => {
    const geocodeLocation = async (location) => {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lng, lat };
      }

      return null;
    };

    const fetchFriendsData = async () => {
      try {
        const friendPoints = await Promise.all(
          users.map(async (user) => {
           
            const { _id, firstName, lastName, location, profileUrl } = user;
            const coordinates = await geocodeLocation(location);

            if (coordinates) {
              return {
                type: "Feature",
                properties: {
                  friendId: _id,
                  name: `${firstName} ${lastName}`,
                  profileUrl,
                },
                geometry: {
                  type: "Point",
                  coordinates: [coordinates.lng, coordinates.lat],
                },
              };
            }

            return null;
          })
        );

        // Remove the setPoints call from here

        supercluster.load(friendPoints.filter(Boolean));
        setClusters(supercluster.getClusters(bounds, zoom));
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };

    fetchFriendsData();
  }, [user, , bounds, zoom]);

  useEffect(() => {
    supercluster.load(points);
    setClusters(supercluster.getClusters(bounds, zoom));
  }, [points, zoom, bounds]);

  useEffect(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat());
    }
  }, [mapRef?.current]);

  return (
    <ReactMapGL
      initialViewState={{ latitude: 51.5072, longitude: 0.1276 }}
      mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      ref={mapRef}
      onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
      style={{ height: "100vh" }}
    >
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties;
        const [longitude, latitude] = cluster.geometry.coordinates;
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <div
                className="cluster-marker"
                onClick={() => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom,
                    speed: 1,
                  });
                }}
              >
                {point_count}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={`friend-${cluster.properties.friendId}`}
            longitude={longitude}
            latitude={latitude}
          >
            <Tooltip title={cluster.properties.name}>
              <Avatar
                src={cluster.properties.profileUrl}
                component={Paper}
                elevation={2}
                onClick={() => {
                  setPopupInfo(cluster.properties);
                  redirectToUserPage(cluster.properties.friendId);
                }}
              />
            </Tooltip>
          </Marker>
        );
      })}
      {/* Add any additional components such as search input, etc. */}
      {popupInfo && (
        <Popup
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          maxWidth="auto"
          closeOnClick={false}
          focusAfterOpen={false}
          onClose={() => setPopupInfo(null)}
        >
          {/* Render friend details in the popup */}
          <div>{popupInfo.name}</div>
          {/* Add other friend details as needed */}
        </Popup>
      )}
      <NavigationControl position="bottom-right" />
      <GeolocateControl
        position="top-left"
        trackUserLocation
        onGeolocate={(e) =>
          dispatch({
            type: "UPDATE_LOCATION",
            payload: { lng: e.coords.longitude, lat: e.coords.latitude },
          })
        }
      />
      <Geocoder />
    </ReactMapGL>
  );
};

export default FindFriendsMap;
