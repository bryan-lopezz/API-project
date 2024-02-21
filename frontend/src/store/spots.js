import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_SPOTS = 'spots/GET_SPOTS';
const GET_SPOT = 'spots/GET_SPOT';
// const CREATE_SPOT = 'spots/CREATE_SPOT';

const getSpots = (spots) => ({
  type: GET_SPOTS,
  spots
})

const getSpot = (spot) => ({
  type: GET_SPOT,
  spot
})

// const createSpot = (spot) => ({
//   type: CREATE_SPOT,
//   spot
// })

export const createNewSpot = (spot) => async dispatch => {
  // const { country, address, city, state, lat, lng, description, name, price, } = body;
  console.log("🚀 ~ createNewSpot ~ body:", spot)
  const response = await csrfFetch('/api/spots', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot)
  });
  // console.log("🚀 ~ createNewSpot ~ response:", response)
  const newSpot = await response.json();

  if(!response.ok) {
    throw new Error('could not create spot')
  }
  await dispatch(getSpot(newSpot))
  return newSpot;
};

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
  // console.log("🚀 ~ getSpotDetails ~ data:", data)

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
      const newState = {...state, [action.spot.id]: action.spot};
      // console.log("🚀 ~ action.spot:", action.spot)
      // console.log("🚀 ~ spotsReducer ~ newState:", newState)
      return newState;
    }
    // case CREATE_SPOT: {
    //   const newState = {...state, [action.spot.id]: action.spot};
    //   console.log("🚀 ~ action.spot:", action.spot)
    //   return newState;
    // }
    default:
      return state;
  }
}

export const selectSpots = (state) => state.spots;
export const selectedSpotsArray =
  createSelector(selectSpots, (spots) => Object.values(spots));

export default spotsReducer;
