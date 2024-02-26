import { useDispatch } from "react-redux";
// import { selectedReviewsArray } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { deleteReviewThunk, getReviewsThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";

const DeleteReview = ({reviewId, spotId}) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // const reviews = useSelector(selectedReviewsArray);
  // console.log("🚀 ~ DeleteReview ~ reviews:", reviews)
  // const sessionUser = useSelector(state => state.session.user?.id);
  // console.log("🚀 ~ DeleteReview ~ sessionUser:", sessionUser)

  useEffect(() => {
    dispatch(getReviewsThunk(spotId))
  }, [spotId, dispatch])

  const deleteReview = async (e) => {
    e.preventDefault();
    await dispatch(deleteReviewThunk(reviewId))
    closeModal();
  };


  // const existingReview = reviews?.find(review => console.log(review.userId));

  return (
    <div>
        <OpenModalButton
          buttonText={'Delete'}
          modalComponent={
            <section>
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this review?</p>
              <button onClick={deleteReview}>Yes (Delete Review)</button>
              <button onClick={() => closeModal()}>No (Keep Review)</button>
            </section>
          }
         />
    </div>
  )
}

export default DeleteReview;
