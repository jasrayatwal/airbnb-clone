import { csrfFetch } from './csrf.js';

const GET_ALL_SPOTS = '/GET_ALL_SPOTS';
const GET_SPOT_DETAIL= '/GET_SPOT_DETAIL';
const CREATE_NEW_SPOT = '/CREATE_NEW_SPOT';
const ADD_SPOT_IMAGE = '/ADD_SPOT_IMAGE';
const GET_USER_SPOTS = '/GET_USER_SPOTS';
const DELETE_SPOT = '/DELETE_SPOT';
const UPDATE_SPOT = '/UPDATE_SPOT';

const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

const loadUserSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
    spots
  }
}

const loadSpotDetails = (spot) => {
  return {
    type: GET_SPOT_DETAIL,
    spot
  }
}

const createSpot = (newSpot) => {
  return {
    type: CREATE_NEW_SPOT,
    spot: newSpot
  }
}

const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot
  }
}

const addImage = (image) => {
  return {
    type: ADD_SPOT_IMAGE,
    image
  }
}

const deleteSpot = (spot) => {
  return {
    type: DELETE_SPOT,
    spot
  }
}

export const addSpotImage = (spotId, imageData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    });

    if (response.ok) {
      const newImage = await response.json();
      dispatch(addImage(newImage));
      return newImage;
    }
  } catch (error) {
    console.error('Error adding spot image: ', error);
    throw error;
  }
};

export const getAllSpots = () => async (dispatch) => {
  try {


    const response = await fetch('/api/spots');

    if (response.ok) {
      console.log(response);
      const data = await response.json();
      dispatch(loadSpots(data.Spots));
      return data;
    }
  }catch (error){
    console.error('Error getting spots: ', error);
    throw error;
  }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`);

    if(response.ok) {
      const data = await response.json();

      dispatch(loadSpotDetails(data));
      return data;
    }
  }catch (error){
    console.error('Error getting spot details: ', error);
    throw error;
  }
}

export const getUserSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots/current');

    if(response.ok) {
      const userSpots = await response.json();

      dispatch(loadUserSpots(userSpots.Spots));
      return userSpots;
    }
  }catch(error){
    console.error('Error getting user spots: ', error);
    throw error;
  }
}

export const updateUserSpot = (spotId, newSpotData) => async (dispatch) => {
  try{
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        country: newSpotData.country,
        address: newSpotData.address,
        city: newSpotData.city,
        state: newSpotData.state,
        lat: newSpotData.lat,
        lng: newSpotData.lng,
        name: newSpotData.name,
        description: newSpotData.description,
        price: newSpotData.price
      })
    });

    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(updateSpot(updatedSpot));
      return updatedSpot;
    }
  }catch(error) {
    console.error('Error updating spot: ', error);
    throw error;
  }
}

export const deleteUserSpot = (spotId) => async (dispatch) => {
  try{
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE'
    });

    if(response.ok){
      const data = await response.json();
      dispatch(deleteSpot(spotId));
      return data;
    }
  }catch(error){
    console.error('Error deleting user spot: ', error);
    throw error;
  }
}

export const makeNewSpot = (spotInfo) => async (dispatch) => {
  try{
    const response = await csrfFetch('/api/spots',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: spotInfo.address,
        city: spotInfo.city,
        state: spotInfo.state,
        country: spotInfo.country,
        lat: spotInfo.lat,
        lng: spotInfo.lng,
        name: spotInfo.name,
        description: spotInfo.description,
        price: spotInfo.price
      })
    });

    if(response.ok){
      const newSpot = await response.json();
      dispatch(createSpot(newSpot));

      const previewImages = spotInfo.previewImage;

      for(let i = 0; i < previewImages.length; i++){
        if(previewImages[i] !== ''){
          await dispatch(addSpotImage(newSpot.id, {
            url: previewImages[i],
            preview: i === 0
          }));
        }
      }
      return newSpot;
    }
  }catch(error){
    console.error('Error creating spot: ', error);
    throw error;
  }
}

const initialState = {allSpots: {}, userSpots: {}, specificSpot: null};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = {allSpots: {}};
      action.spots.forEach((spot) => (newState.allSpots[spot.id] = spot));
      return newState;
    }
    case GET_USER_SPOTS: {
      const newState = { ...state, userSpots: {} };
      action.spots.forEach(spot => {
        newState.userSpots[spot.id] = spot;
      });
      return newState;
    }
    case GET_SPOT_DETAIL: {
      return {
        ...state,
        specificSpot: action.spot
      }
    }
    case CREATE_NEW_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot
        }
      }
    }
    case UPDATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot
        },
        userSpots: {
          ...state.userSpots,
          [action.spot.id]: action.spot
        },
        specificSpot: action.spot
      };
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.spot];
      delete newState.userSpots[action.spot];
      return newState;
    }
    case ADD_SPOT_IMAGE: {
      if (state.specificSpot && state.specificSpot.id === action.image.spotId) {
        return {
          ...state,
          specificSpot: {
            ...state.specificSpot,
            SpotImages: [...(state.specificSpot.SpotImages || []), action.image]
          }
        };
      }
      return state;
    }
    default: return state;
  }
}

export default spotsReducer;
