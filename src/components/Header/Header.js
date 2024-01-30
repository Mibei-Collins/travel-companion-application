import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Modal,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import CloudTwoToneIcon from '@material-ui/icons/CloudTwoTone';
import axios from 'axios';
import './style.css';
import useStyles from './styles';

const Header = ({ handleThemeChange }) => {
  const classes = useStyles();
  const [data, setData] = useState({
    celcius: 22,
    name: 'Nakuru',
    humidity: 93,
    speed: 4,
    image: '/images/cloud.png',
  });
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleSearch = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClick = () => {
    if (name !== '') {
      const apiUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${name}`;
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
          setData({
            ...data,
            celcius: res.data.current.temp_c,
            name: res.data.location.name,
            humidity: res.data.current.humidity,
            speed: res.data.current.wind_kph,
            image: imagePath,
          });
          setError('');
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setError('City not found');
          } else {
            setError('');
          }
        });
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Box display="flex" alignItems="center">
            <img src="/images/header.png" alt="Logo" className={classes.logo} />
            <Typography variant="h4" className={classes.title}>
              Travel Companion
            </Typography>
            <IconButton
              onClick={handleThemeChange}
              aria-label="Toggle Dark Mode"
              color="inherit"
            >
              <Brightness4Icon />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center">
            <Typography variant="h6" className={classes.title}>
              Explore how is the weather today:
            </Typography>
            <div className={classes.buttonContainer}>
              <IconButton
                className={classes.iconButton}
                onClick={handleSearch}
                color="inherit"
              >
                <CloudTwoToneIcon fontSize="large" />
              </IconButton>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(130deg, #A5DBDD, #407C87)',
            border: '1px solid white',
            borderRadius: '18px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <IconButton
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              marginBottom: '10px',
              color: 'white',
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          <div className="container">
            <div className="weather">
              <div className="search">
                <input
                  type="text"
                  placeholder="Enter City Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button type="button" onClick={handleClick}>
                  <SearchOutlinedIcon />
                </button>
              </div>
              <div className="error">
                <p>{error}</p>
              </div>
              <div className="winfo">
                <img src={data.image} alt="" className="icon" />
                <h1>{Math.round(data.celcius)}°c</h1> <h2>{data.name}</h2>
                <div className="details">
                  <div className="col">
                    <img src="/Images/humidity.png" alt="" />
                    <div className="humidity">
                      <p>{Math.round(data.humidity)}%</p> <p>Humidity</p>
                    </div>
                  </div>
                  <div className="col">
                    <img src="/Images/mist.png" alt="" />
                    <div className="wind">
                      <p>{Math.round(data.speed)} km/h</p> <p>Wind</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;
