import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { getReviewsThunk } from "../../store/reviews";
import { selectedReviewsArray } from "../../store/reviews";
import CreateReview from "../CreateReview";
import DeleteReview from "../DeleteReview";

const GetSpotReviews = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviewsState = useSelector(selectedReviewsArray)
  const reviews = [...reviewsState].reverse();
  const sessionUser = useSelector(state => state.session.user?.id)
  const spot = useSelector(state => state.spots?.[spotId]);

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

  return (
      <section>
        {!reviews.length && sessionUser && sessionUser !== spot?.Owner?.id && (
          <div>Be the first to post a review!</div>
        )}
        {
          reviews.map(review => (
            <div key={review.id}>
              <div className="name-date">
                <div>{review.User?.firstName}</div>
                <span>{`${months[new Date(review.createdAt).getMonth()]} ${new Date(review.createdAt).getFullYear()}`}</span>
              </div>
              <div className="review-description">{review.review}</div>
              {review.userId === sessionUser && (
                <DeleteReview reviewId={review.id} spotId={spotId}/>
              )}
            </div>
          )
        )}
      </section>
  )
}

export default GetSpotReviews;
