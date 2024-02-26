import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { selectedSpotsArray } from "../../store/spots";
import { getCurrentSpotsThunk } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.session.user);
  const spots = useSelector(selectedSpotsArray);

  useEffect(() => {
    !currentUser && navigate('/');

    dispatch(getCurrentSpotsThunk())
  }, [currentUser, dispatch, navigate])

  return (
    <>
      {currentUser && (
        <div>
          <section className="main-heading">
            <h1>Manage Spots</h1>
            <button onClick={() => navigate('/spots/new')}>Create a New Spot</button>
          </section>
          <section>
            {spots.map(spot => (
              <div key={spot.id}>
                <NavLink to={`/spots/${spot.id}`}>
                  <div title={spot.name} className='spot-container'>
                    <img src={spot.previewImage} alt={`${spot.name} image`} />
                    <div className="listing-info">
                      <div className="location-details">
                        <span>{`${spot.city}, ${spot.state}`}</span>
                        <p><span>{`$${spot.price}`}</span>night</p>
                      </div>
                      <div className="rating">
                        <h4>{spot?.avgRating?.toFixed(1)}</h4>
                      </div>
                    </div>
                  </div>
                </NavLink>
                <button className="update-spot-button" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                <OpenModalButton buttonText={"Delete"} modalComponent={<DeleteSpot spotId={spot.id} /> } />
              </div>
              ))}
          </section>
        </div>

      )}
    </>
  )
}

export default ManageSpots;
