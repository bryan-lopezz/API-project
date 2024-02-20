import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots } from '../../store/spots';
// import { NavLink } from "react-router-dom";
import { selectedSpotsArray } from "../../store/spots";

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(selectedSpotsArray)
  // console.log("🚀 ~ LandingPage ~ spots:", spots)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch]);

  return (
    <div className="spots-container">
      <h1>Landing Page</h1>
      {spots.map(spot => (
        <div>
          <img src="" alt={`${spot.name} image`} />
        </div>
      ))}
    </div>
  )
}

export default LandingPage;
