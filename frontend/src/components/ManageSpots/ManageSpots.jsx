import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { selectedSpotsArray } from "../../store/spots";
import { getCurrentSpotsThunk } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import "./ManageSpots.css";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);
  const spots = useSelector(selectedSpotsArray);

  useEffect(() => {
    !currentUser && navigate("/");

    dispatch(getCurrentSpotsThunk());
  }, [currentUser, dispatch, navigate]);

  return (
    <div>
      {currentUser && (
        <div className="">
          <div className="main-heading">
            <h1>Manage Your Spots</h1>
            <button className="manage-create-new-spot-button" onClick={() => navigate("/spots/new")}>
              Create a New Spot
            </button>
          </div>
          <div className="manage-spots-container-2">
            {spots.map((spot) => (
              <div key={spot.id} className="manage-spot-tile">
                <NavLink to={`/spots/${spot.id}`}>
                  <div title={spot.name} >
                    <img
                      className="manage-tile-image"
                      src={spot.previewImage}
                      alt={`${spot.name} image`}
                    />
                    <div className="manage-listing-info">
                      <div className="manage-location-details">
                        <span>{`${spot.city}, ${spot.state}`}</span>
                        <div className="manage-rating">

                            <i className="fas fa-star"></i>
                            {spot?.avgRating?.toFixed(1)}

                        </div>
                      </div>
                      <p>
                        <span>{`$${spot.price}`}</span> night
                      </p>
                    </div>
                  </div>
                </NavLink>
                <button
                  className="update-spot-button"
                  onClick={() => navigate(`/spots/${spot.id}/edit`)}
                >
                  Update
                </button>
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteSpot spotId={spot.id} />}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSpots;
