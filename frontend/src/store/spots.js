
const GET_ALL_SPOTS = '/';

const loadSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

export const getAllSpots = () => async (dispatch) => {
  const response = await fetch('api/spots');

  if (response.ok) {
    const data = await response.json();

    dispatch(loadSpots(data.Spots));
    return data;
  }
};

const initialState = {};


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
