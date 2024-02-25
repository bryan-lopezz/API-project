import { csrfFetch } from "./csrf";
import { createSelector } from 'reselect';

const GET_REVIEWS = 'reviews/GET_REVIEWS';
// const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
// const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const getReviews = (reviews) => {
  console.log("🚀 ~ getReviews ~ reviews:", reviews)
  return {
    type: GET_REVIEWS,
    reviews
  }
}

// const createReview = (review) => ({
//   type: CREATE_REVIEW,
//   review
// })

// const deleteReview = (reviewId) => ({
//   type: DELETE_REVIEW,
//   reviewId
// })

export const getReviewsThunk = (spotId) => async dispatch => {
const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

const reviews = await response.json();
dispatch(getReviews(reviews));
return reviews;
};

// export const createReviewThunk = (review, spotId) => async dispatch => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(review)
//     });

//     const newReview = await response.json();
//     await dispatch(createReview(newReview))
//     return newReview;
//   };

//   export const deleteReviewThunk = (reviewId) => async dispatch => {
//       await csrfFetch(`/api/reviews/${reviewId}`, {
//       method: 'DELETE'
//     })

//     await dispatch(deleteReview(reviewId));
//   }



function reviewsReducer(state = {}, action) {
  switch(action.type) {
    case GET_REVIEWS: {
      const newStateObj = {};
      action.reviews.Reviews.forEach((review) => newStateObj[review.id] = review)
      return newStateObj;
    }
  //   case GET_SPOT: {
  //     const newState = {[action.spot.id]: action.spot};
  //     // console.log("🚀 ~ action.spot:", action.spot)
  //     // console.log("🚀 ~ spotsReducer ~ newState:", newState)
  //     return newState;
  //   }
  //   case GET_CURRENT_USER_SPOTS: {
  //     const newState = {}
  //     action.spots.Spots.forEach(spot => newState[spot.id] = spot)
  //     return newState
  //   }
  //   case CREATE_SPOT: {
  //     const newState = {...state, [action.spot.id]: action.spot};
  //     // console.log("🚀 ~ action.spot:", action.spot)
  //     return newState;
  //   }
  //   case UPDATE_SPOT: {
  //     const newState = {...state, [action.spot.id]: action.spot};
  //     return newState;
  //   }
  //   case DELETE_SPOT: {
  //     console.log('this is the state:', state)
  //     const newState = {...state}
  //     delete newState[action.spotId]
  //     return newState;
  //   }
    default:
      return state;
  }
}

export const selectReviews = (state) => state.reviews;
export const selectedReviewsArray =
  createSelector(selectReviews, (reviews) => Object.values(reviews));

export default reviewsReducer;
