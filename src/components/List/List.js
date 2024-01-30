import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

const List = ({ places, type, setType, rating, setRating, childClicked, isLoading }) => {
  const [elRefs, setElRefs] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
  }, [places]);

  const filteredPlaces = selectedCuisines.length
    ? places.filter((place) => selectedCuisines.every((cuisine) => place.cuisine.map((c) => c.name).includes(cuisine)))
    : places;

  const cuisineOptions = [
    'Cafe', 'Healthy', 'Vegetarian Friendly', 'Vegan Options', 'Seafood', 'International',
    'African', 'Ethiopian', 'French', 'Indian', 'Italian', 'American', 'European', 'Asian', 'Fast Food', 'Pizza',
    'Bar', 'Pub', 'Wine Bar', 'Barbecue', 'Diner',
  ];

  const handleCuisinePreference = (cuisine) => {
    setSelectedCuisines((prevCuisines) => {
      if (prevCuisines.includes(cuisine)) {
        // Remove cuisine if already selected
        return prevCuisines.filter((selectedCuisine) => selectedCuisine !== cuisine);
      }
      // Add cuisine if not selected
      return [...prevCuisines, cuisine];
    });
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4">Places around you</Typography>
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <div>
            {cuisineOptions.map((cuisine) => (
              <Button
                key={cuisine}
                variant={selectedCuisines.includes(cuisine) ? 'contained' : 'outlined'}
                onClick={() => handleCuisinePreference(cuisine)}
                className={`${classes.cuisineButton} ${selectedCuisines.includes(cuisine) ? classes.selectedCuisineButton : ''}`}
              >
                {cuisine}
              </Button>
            ))}
          </div>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={3} className={classes.list}>
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place, i) => (
                <Grid ref={elRefs[i]} key={i} item xs={12}>
                  <PlaceDetails selected={Number(childClicked) === i} refProp={elRefs[i]} place={place} />
                </Grid>
              ))
            ) : (
              places.map((place, i) => (
                <Grid ref={elRefs[i]} key={i} item xs={12}>
                  <PlaceDetails selected={Number(childClicked) === i} refProp={elRefs[i]} place={place} />
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}
    </div>
  );
};

export default List;
