import { csrfFetch } from './csrf.js';

const GET_ALL_SPOTS = '/GET_ALL_SPOTS';
const GET_SPOT_DETAIL= '/GET_SPOT_DETAIL';
const CREATE_NEW_SPOT = '/CREATE_NEW_SPOT';

const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
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
    newSpot
  }
}

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
      console.log(response);
      const data = await response.json();

      dispatch(loadSpotDetails(data));
      return data;
    }
  }catch (error){
    console.error('Error getting spot details: ', error);
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
      body: JSON.stringify(spotInfo)
    });

    if(response.ok){
      const newSpot = await response.json();
      dispatch(createSpot(newSpot));
      return newSpot;
    }
  }catch(error){
    console.error('Error creating spot: ', error);
    throw error;
  }
}

const initialState = {allSpots: {}};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = {allSpots: {}};
      action.spots.forEach((spot) => (newState.allSpots[spot.id] = spot));
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
    default: return state;
  }
}

export default spotsReducer;
