import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSpotDetails } from "../../store/spots";
import { useParams } from "react-router-dom";

const SpotDetailsPage = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots[spotId]);
  console.log("🚀 ~ SpotDetailsPage ~ spot:", spot)

  useEffect(() => {
    dispatch(getSpotDetails(spotId))
  }, [dispatch]);

  const handleReserveClick = () => {
    alert("Feature coming soon!")
  };

  return (
    <>
      <h1>◕‿‿◕</h1>
      <div>
        {spot && (
          <>
            <div className="spot-details-image-container">
             <h2>{spot.name}</h2>
             <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
             <img src="https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg" alt={`image of ${spot.name}`} />
             <div>
               {spot.SpotImages?.map(image => (
                 <h3 key={image.id}>{image.url}</h3>
                 ))}
             </div>
            </div>
            <div className="spot-details-info-container">
              <div className="spot-description-container">
                <h3>{`Hosted by ${spot.Owner?.firstName}, ${spot.Owner?.lastName}`}</h3>
                <p>{spot.description}</p>
              </div>
              <div className="spot-callout-container">
                <div className="spot-callout-info">
                  <span className="spot-callout-price">{`$${spot.price}`}</span>
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
