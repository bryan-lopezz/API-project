import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots } from '../../store/spots';
import { NavLink } from "react-router-dom";
import { selectedSpotsArray } from "../../store/spots";
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(selectedSpotsArray)
  // console.log("🚀 ~ LandingPage ~ spots:", spots)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch]);

  return (
    <div>
      <h1>◕‿‿◕ / \ ◕‿‿◕ </h1>
      {spots.map(spot => (
        <NavLink key={spot.id} to={`/spots/${spot.id}`}>
          <div title={spot.name} className='spot-container'>
            <img width='100' height='48' src="https://res.cloudinary.com/lopez-projects/image/upload/v1708405213/cld-sample-4.jpg" alt={`${spot.name} image`} />
            <div className="listing-info">
              <div className="location-details">
                <h4>{`${spot.city}, ${spot.state}`}</h4>
                <h4>{`${spot.price}/night`}</h4>
              </div>
              <div className="rating">
                <h4>{spot.avgRating}</h4>
              </div>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  )
}

export default LandingPage;
