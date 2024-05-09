import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";
import GetSpotReviews from "../GetSpotReviews";
import CreateReview from "../CreateReview";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { selectedReviewsArray } from "../../store/reviews";
import './SpotDetailsPage.css'

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots);
  const selectedSpot = spot[spotId];
  const reviewsState = useSelector(selectedReviewsArray);
  const sessionUser = useSelector(state => state.session.user?.id);


  useEffect(() => {
    dispatch(getSpotDetails(spotId))
  }, [dispatch, spotId]);

  const handleReserveClick = () => {
    alert("Feature coming soon!")
  };

  const reviews = () => {
    if (selectedSpot.numReviews > 1 && selectedSpot.avgStarRating) {
      return (`${selectedSpot.avgStarRating.toFixed(1)} · ${selectedSpot.numReviews} reviews`);
    }
    if (selectedSpot.numReviews === 1 && selectedSpot.avgStarRating) {
      return (`${selectedSpot.avgStarRating.toFixed(1)} · ${selectedSpot.numReviews} review`);
    }
    return 'New';
  }

  const findUserReview =
  reviewsState.some((review) =>
    review.User?.id === sessionUser
  );

  return (
    <>
      <div>
        {selectedSpot && (
          <section className="body">
            <section className="spot-header">
               <h2>{selectedSpot.name}</h2>
               <span className="header-location">{`${selectedSpot.city}, ${selectedSpot.state}, ${selectedSpot.country}`}</span>
            </section>
            <section className="image-container">
               <div className="main-image-container">
                <img className="spot-details-main-image" src={selectedSpot.SpotImages?.[0]?.url} alt={`main image of ${selectedSpot.name}`} />
               </div>
               <div className="small-images-container">
                <img className="small-images" src={selectedSpot.SpotImages?.[1]?.url} alt="small image one" />
                <img className="small-image-edge-one small-images" src={selectedSpot.SpotImages?.[2]?.url} alt="small image two" />
                <img className="small-images" src={selectedSpot.SpotImages?.[3]?.url} alt="small image three" />
                <img className="small-image-edge-two small-images" src={selectedSpot.SpotImages?.[4]?.url} alt="small image four" />
             </div>
            </section>
            <section className="info-container">
              <div className="description-container">
                <h2 className="host-name">{`Hosted by ${selectedSpot.Owner?.firstName}, ${selectedSpot.Owner?.lastName}`}</h2>
                <p>{selectedSpot.description}</p>
              </div>
              <div className="spot-callout-container">
                <div className="spot-callout-info">
                  <div className="spot-callout-left">
                    <p className="spot-price"><span className="spot-callout-price">{`$${selectedSpot.price}`}</span><span className="price-night">night</span></p>
                  </div>
                  <div className="spot-callout-right">
                    <p className="star-and-review"><i className="fa-solid fa-star"></i><span className="rating-review"> {reviews()}</span></p>
                  </div>
                </div>
                  <button
                    className="reserve-button"
                    onClick={handleReserveClick}
                    >
                      Reserve
                  </button>
              </div>
            </section>
            <section className="reviews-container">
              <p className="star-reviews"><i className="fa-solid fa-star" style={{fontSize: 'x-large'}}></i><span className="rating-review-2" style={{fontSize: 'x-large', fontWeight: 'bold'}}> {reviews()}</span></p>
              {!findUserReview && sessionUser && sessionUser !== selectedSpot?.ownerId && (
                <OpenModalButton
                  modalComponent={<CreateReview />}
                  buttonText={'Post Your Review'}
                />
              )}
              <GetSpotReviews />
            </section>
          </section>
        )}
      </div>
    </>
  )
}

export default SpotDetailsPage;
