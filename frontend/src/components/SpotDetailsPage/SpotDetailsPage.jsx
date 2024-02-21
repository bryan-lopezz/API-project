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
         <h2>{spot.name}</h2>
         <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
      </div>
    </>
  )
}

export default SpotDetailsPage;
