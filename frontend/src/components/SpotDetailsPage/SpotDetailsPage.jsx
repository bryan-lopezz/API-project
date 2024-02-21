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
  }, [dispatch])

  return (
    <>
      <h1>◕‿‿◕</h1>
      <div>
        {spot && (
          <>
           <h2>{spot.name}</h2>
           <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
           <div>
             {spot.SpotImages.map(image => (
               <h3 key={image.id}>{image.url}</h3>
               ))}
           </div>
           <img src="https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg" alt={`image of ${spot.name}`} />
          </>
        )}
      </div>
    </>
  )
}

export default SpotDetailsPage;
