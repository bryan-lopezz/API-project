import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { selectedReviewsArray } from "../../store/reviews";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { FaStar } from 'react-icons/fa';
import { createReviewThunk } from "../../store/reviews";
import { getSpotDetails } from "../../store/spots";
import './CreateReview.css'


const CreateReview = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviews = useSelector(selectedReviewsArray);
  const sessionUser = useSelector(state => state.session.user?.id);
  // console.log("🚀 ~ CreateReview ~ sessionUser:", sessionUser)
  const spotOwner = useSelector(state => state.spots?.[spotId].ownerId);
  // console.log("🚀 ~ CreateReview ~ spotOwner:", spotOwner)
  const { closeModal } = useModal();
  const [review, setReview] = useState('');
  const [hover, setHover] = useState(0);
  const [stars, setStars] = useState(0);
  const [validations, setValidations] = useState({});
  const starRatings = [1, 2, 3, 4, 5];
  const reviewed = reviews?.find(review => review.userId === sessionUser);

  useEffect(() => {

    const validationsObj = {};

    if (review.length < 10) {
      validationsObj.review = 'Please write at least 10 characters';
    } else {
      delete validationsObj.review;
    }

    if (!stars) {
      validationsObj.stars = 'Please select a star rating';
    } else {
      delete validationsObj.stars;
    }

    setValidations(validationsObj);
  }, [review, stars]);

  useEffect(() => {
    return () => {
      setReview('');
      setStars(0);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars
    }

    await dispatch(createReviewThunk(newReview, spotId))
    await dispatch(getSpotDetails(spotId))
    closeModal();
    setReview('');
    setStars(0);
  }

  // check if logged in
  // compare the spot owners id to the session user id
  // if not spot owner check the list of existing reviews
  // if reviews array does not include user id, show post review button


  return (
    <>
      {sessionUser && (sessionUser !== spotOwner) && !reviewed && (
            <form onSubmit={onSubmit}>
              <h2>How was your stay?</h2>
              <textarea
                placeholder="Leave your review here..."
                minLength={10}
                value={review}
                onChange={e => setReview(e.target.value)}
               />
               <div>
                {starRatings.map((star, index) => {
                  const rating = index + 1;
                  return (
                  <label key={rating}>
                    <input
                      type="radio"
                      value={rating}
                      onChange={() => setStars(rating)}
                      />
                      <FaStar
                        className="stars"
                        style={{color: (hover || stars) >= rating ? 'gold' : 'grey'}}
                        onMouseEnter={() => setHover(rating)}
                        onMouseLeave={() => setHover(0)}
                      />
                  </label>
                  )
                })}
                 Stars
               </div>
               <button
               disabled={Object.values(validations).length > 0}
               className="submit-review"
               type="submit" >
                Submit Your Review
               </button>
            </form>
      )}
    </>
  )
}

export default CreateReview;
