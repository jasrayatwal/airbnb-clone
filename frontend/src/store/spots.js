import { csrfFetch } from './csrf.js';

const GET_ALL_SPOTS = '/GET_ALL_SPOTS';

const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

export const getAllSpots = () => async (dispatch) => {
  try {


    const response = await csrfFetch('/api/spots');

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

const initialState = {allSpots: {}};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = {allSpots: {}};
      action.spots.forEach((spot) => (newState.allSpots[spot.id] = spot));
      return newState;
    }
    default: return state;
  }
}

export default spotsReducer;
