import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT = 'spots/GET_SPOT';

const getSpots = (spots) => ({
  type: GET_SPOTS,
  spots
})

const getSpot = (spot) => ({
  type: GET_SPOT,
  spot
})

export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots', {
  });

  const data = await response.json();
  // console.log("🚀 ~ getAllSpots ~ data:", data)

  dispatch(getSpots(data));
  return response;
};

export const getSpotDetails = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
  });

  const data = await response.json();
  console.log("🚀 ~ getSpotDetails ~ data:", data)

  dispatch(getSpot(data));
  return response;
};

function spotsReducer(state = {}, action) {
  switch(action.type) {
    case GET_SPOTS: {
      // console.log("🚀 ~ action.spots:", action.spots)
      const newStateObj = {};
      action.spots.Spots.forEach((spot) => newStateObj[spot.id] = spot)
      return newStateObj;
    }
    case GET_SPOT: {
      const newState = {[action.spot.id]: action.spot};
      console.log("🚀 ~ action.spot:", action.spot)
      console.log("🚀 ~ spotsReducer ~ newState:", newState)
      return newState;
    }
    default:
      return state;
  }
}

export const selectSpots = (state) => state.spots;
export const selectedSpotsArray =
  createSelector(selectSpots, (spots) => Object.values(spots));

export default spotsReducer;
