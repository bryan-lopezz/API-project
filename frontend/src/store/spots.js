import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_SPOTS = 'spots/GET_SPOTS';

const getSpots = (spots) => ({
  type: GET_SPOTS,
  spots
})

export const getAllSpots = () => async dispatch => {
  const response = await csrfFetch('/api/spots', {
  });

  const data = await response.json();
  console.log("🚀 ~ getAllSpots ~ data:", data)

  dispatch(getSpots(data));
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
    default:
      return state;
  }
}

export const selectSpots = (state) => state.spots;
export const selectedSpotsArray =
  createSelector(selectSpots, (spots) => Object.values(spots));

export default spotsReducer;
