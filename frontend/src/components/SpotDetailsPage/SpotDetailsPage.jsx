import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots);
  const selectedSpot = spot[spotId];
  console.log("🚀 ~ SpotDetailsPage ~ spot:", spot)

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
  }, [dispatch, spotId]);

  const handleReserveClick = () => {
    alert("Feature coming soon!")
  };

  return (
    <>
      <h1>◕‿‿◕</h1>
      <div>
        {selectedSpot && (
          <>
            <div className="spot-details-image-container">
             <h2>{selectedSpot.name}</h2>
             <h3>{`${selectedSpot.city}, ${selectedSpot.state}, ${selectedSpot.country}`}</h3>
             <div className="spot-details-main-image-container">
              <img className="spot-details-main-image" src={selectedSpot.SpotImages?.[0]?.url} alt={`main image of ${selectedSpot.name}`} />
             </div>
             <div className="spot-details-small-images-container">
              <img className="spot-details-small-image" src={selectedSpot.SpotImages?.[1]?.url} alt="small image one" />
              <img className="spot-details-small-image" src={selectedSpot.SpotImages?.[2]?.url} alt="small image two" />
              <img className="spot-details-small-image" src={selectedSpot.SpotImages?.[3]?.url} alt="small image three" />
              <img className="spot-details-small-image" src={selectedSpot.SpotImages?.[4]?.url} alt="small image four" />
             </div>
            </div>
            <div className="spot-details-info-container">
              <div className="spot-description-container">
                <h3>{`Hosted by ${selectedSpot.Owner?.firstName}, ${selectedSpot.Owner?.lastName}`}</h3>
                <p>{selectedSpot.description}</p>
              </div>
              <div className="spot-callout-container">
                <div className="spot-callout-info">
                  <span className="spot-callout-price">{`$${selectedSpot.price}`}</span>
                  <span className="night">night</span>
                  <button
                    className="spot-callout-button"
                    onClick={handleReserveClick}
                    >
                      Reserve
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default SpotDetailsPage;
