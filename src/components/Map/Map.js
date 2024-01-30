import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { useLoadScript } from '@react-google-maps/api';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';

import mapStyles from '../../mapStyles';
import useStyles from './styles.js';

const defaultCenter = {
  lat: -0.30309880,
  lng: 36.08002600,
};

const MapItem = ({ className, children }) => <div className={className}>{children}</div>;

const libraries = ['geometry', 'drawing', 'places'];

const Map = ({ coords, places, setCoords, setBounds, setChildClicked }) => {
  const matches = useMediaQuery('(min-width:600px)');
  const classes = useStyles();

  const reactMapKey = 'AIzaSyD6YSoLd-1FONTrHoyJD26Eo8CYlLc-fp0';

  const [weatherData, setWeatherData] = useState(null);

  const handleClick = () => {
    if (coords) {
      const apiUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${coords.lat},${coords.lng}`;
      const options = {
        method: 'GET',
        url: apiUrl,
        headers: {
          'X-RapidAPI-Key': '7c4b562afcmshcbae7563ee3f700p143e29jsnd615770d09b3',
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
        },
      };

      axios
        .request(options)
        .then((res) => {
          let imagePath = '';
          if (res.data.current.condition.text.includes('Cloud')) {
            imagePath = '/images/cloud.png';
          } else if (res.data.current.condition.text.includes('Clear')) {
            imagePath = '/images/clear.png';
          } else if (res.data.current.condition.text.includes('Rain')) {
            imagePath = '/images/snow.png';
          } else if (res.data.current.condition.text.includes('Drizzle')) {
            imagePath = '/images/rain.png';
          } else if (res.data.current.condition.text.includes('Mist')) {
            imagePath = '/images/mist.png';
          } else {
            imagePath = '/images/cloud.png';
          }
          setWeatherData({
            ...res.data,
            image: imagePath,
          });
        });
    }
  };

  useEffect(() => {
    if (coords) {
      handleClick();
    }
  }, [coords]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: reactMapKey,
    version: '3.exp',
    libraries,
  });

  if (!isLoaded) return 'Loading...';

  const weatherIconsArray = Array.from({ length: 4 }, (_, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const lat = coords.lat + (row - 0.25) * 0.01;
    const lng = coords.lng + (col - 0.25) * 0.01;

    return (
      <MapItem
        className={classes.weatherIconContainer}
        lat={lat}
        lng={lng}
        key={index}
      >
        <img
          src={weatherData?.image}
          alt="Weather Icon"
          style={{ width: '50px', height: '50px' }}
        />
      </MapItem>
    );
  });

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        defaultCenter={defaultCenter}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => setChildClicked(child)}
      >
        {places.length && places.map((place, i) => (
          <MapItem
            className={classes.markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!matches
              ? <LocationOnOutlinedIcon color="primary" fontSize="large" />
              : (
                <Paper elevation={3} className={classes.paper}>
                  <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
                  <img
                    className={classes.pointer}
                    src={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/ant-Placeholder-001.jpg'}
                  />
                  <Rating name="read-only" size="small" value={Number(place.rating)} readOnly />
                </Paper>
              )}
          </MapItem>
        ))}
        {weatherIconsArray}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
