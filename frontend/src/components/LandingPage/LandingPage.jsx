import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpots } from '../../store/spots';
import { NavLink } from "react-router-dom";
import { selectedSpotsArray } from "../../store/spots";
import './LandingPage.css';

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(selectedSpotsArray)
  console.log("🚀 ~ LandingPage ~ spots:", spots)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch]);

  return (
    <>
      <h1>◕‿‿◕ / \ ◕‿‿◕ </h1>
      <section>
        {spots.map(spot => (
          <div key={spot.id}>
            <NavLink to={`/spots/${spot.id}`}>
              <div title={spot.name} className='spot-container'>
                <img width='100' height='48' src={spot.previewImage} alt={`${spot.name} preview image`} />
                <div className="listing-info">
                  <div className="location-details">
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <h4>{`${spot.price}/night`}</h4>
                    <span></span>
                  </div>
                  <div className="rating">
                    <h4>{spot.avgRating}</h4>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
          ))}
          </section>
    </>
  )
}

export default LandingPage;
