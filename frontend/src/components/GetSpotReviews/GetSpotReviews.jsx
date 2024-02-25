import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { getReviewsThunk } from "../../store/reviews";
import { selectedReviewsArray } from "../../store/reviews";

const GetSpotReviews = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviewsState = useSelector(selectedReviewsArray)
  const reviews = [...reviewsState].reverse();
  const sessionUser = useSelector(state => state.session.user?.id)
  const spotOwner = useSelector(state => state.spots.ownerid);
  console.log("🚀 ~ GetSpotReviews ~ reviews:", reviews)

  // if(!reviews) {
  //   return
  // };

  useEffect(() => {
    dispatch(getReviewsThunk(spotId))
  }, [dispatch, spotId])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  reviews.forEach(review => {
    console.log(months[new Date(review.createdAt).getMonth()])
  })



  return (
      <section>
        {!reviews.length && sessionUser && sessionUser !== spotOwner && (
          <span>Be the first to post a review!</span>
        )}
        {
          reviews.map(review => (
            <div key={review.id}>
              <div className="name-date">
                <div>{review.User?.firstName}</div>
                <span>{`${months[new Date(review.createdAt).getMonth()]} ${new Date(review.createdAt).getFullYear()}`}</span>
              </div>
              <div className="review-description">{review.review}</div>
            </div>
          )
        )}
      </section>
  )
}

export default GetSpotReviews;
