import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateSpotThunk } from "../../store/spots";
import { useNavigate, useParams } from 'react-router-dom';
import { getSpotDetails } from "../../store/spots";
import './UpdateSpot.css'

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots[spotId])
  console.log("🚀 ~ UpdateSpot ~ spot:", spot)
  const currentUser = useSelector(state => state.session.user)

  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  // const [lat, setLatitude] = useState();
  // const [lng, setLongitude] = useState();
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price);

  // const [previewImg, setPreviewImg] = useState('');
  // const [imageTwo, setImageTwo] = useState('');
  // const [imageThree, setImageThree] = useState('');
  // const [imageFour, setImageFour] = useState('');
  // const [imageFive, setImageFive] = useState('');

  const [validations, setValidations] = useState({});

  useEffect(() => {
    !currentUser && navigate('/');

    const validationsObj = {};

    !country && (
      validationsObj.country = 'Country is required.'
    )

    !address && (
      validationsObj.address = 'Address is required.'
    )

    !city && (
      validationsObj.city = 'City is required.'
    )

    !state && (
      validationsObj.state = 'State is required.'
    )

    description?.length < 30 && (
      validationsObj.description = 'Description should be at least 30 characters.'
    )

    !name && (
      validationsObj.name = 'Name is required.'
    )

    !price && (
      validationsObj.price = 'Price is required.'
    )

    // !previewImg && (
    //   validationsObj.previewImg = 'Please add a preview image.'
    // )

    setValidations(validationsObj)
  }, [country, address, city, state, description, name, price, currentUser, navigate])

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const newSpot = {
      ownerId: currentUser.id,
      country,
      address,
      city,
      state,
      lat: 0,
      lng: 0,
      description,
      name,
      price,
    }

    // const newSpotImages = {
    //   previewImg,
    //   imageTwo,
    //   imageThree,
    //   imageFour,
    //   imageFive
    // }

    const updatedSpot = await dispatch(updateSpotThunk(newSpot, spotId));
    dispatch(getSpotDetails(updatedSpot))
    navigate(`/spots/${updatedSpot.id}`)
  }

  return (
<>
      {currentUser && (
        <form className="create-spot-form" onSubmit={handleOnSubmit}>
          <div className="section-line">
            <h1>Update Your Spot</h1>
            <h3 className="where-located">Where&apos;s your place located?</h3>
            <p className="guests-will-only">
              Guests will only get your exact address once they booked a
              reservation.
            </p>
            <label className="country-address">
              {<span>Country</span>}
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </label>
            {validations.country && <span className="validation-message">{validations.country}</span>}
            <label className="country-address">
              {<span>Street Address</span>}
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {/* {validations.address && <span className="validation-message">{validations.address}</span>} */}
            </label>
            <div className="city-state-container">
              <label className="city-input">
                {<div>City</div>}
                <input
                  className="city-textbox"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <span className="comma-separator"> ,</span>
                {/* {validations.city && <span className="validation-message">{validations.city}</span>} */}
              </label>
              <label htmlFor="state">
                {<div>State</div>}
                <input
                  type="text"
                  name="state"
                  placeholder="STATE"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {/* {validations.state && <span className="validation-message">{validations.state}</span>} */}
              </label>
            </div>
            {/* <label htmlFor="lat">
              Latitude
              <input
                type="text"
                name="lat"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLatitude(e.target.value)} />
            </label>
            <label htmlFor="longitude">
              Longitude
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLongitude(e.target.value)} />
            </label> */}
          </div>
          <div className="create-spot-section-2 section-line">
            <h3>Describe your place to guests</h3>
            <p>
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <textarea
              placeholder="Please write at least 30 characters"
              cols="45"
              rows="8"
              minLength={30}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {/* {validations.description && <span className="validation-message">{validations.description}</span>} */}
          </div>
          <div className="create-spot-section-3 section-line">
            <h3>Create a tile for your spot</h3>
            <p>
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special.
            </p>
            <input
              className="spot-name-input"
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* {validations.name && <span className="validation-message">{validations.name}</span>} */}
          <div className="create-spot-section-4 section-line">
            <h3>Set a base price for your spot</h3>
            <p>
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <span>$ </span>
            <input
              className="price-input"
              type="number"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {/* {validations.price && <span className="validation-message">{validations.price}</span>} */}
          {/* <div className="create-spot-section-5 section-line">
            <h3 className="liven-up">Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <div className="image-inputs">
              <input
                type="text"
                placeholder="Preview Image URL"
                value={previewImg}
                onChange={(e) => setPreviewImg(e.target.value)}
              />
              {validations.previewImg && <span className="validation-message">{validations.previewImg}</span>}
              <input
                type="text"
                placeholder="Image URL"
                value={imageTwo}
                onChange={(e) => setImageTwo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={imageThree}
                onChange={(e) => setImageThree(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={imageFour}
                onChange={(e) => setImageFour(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={imageFive}
                onChange={(e) => setImageFive(e.target.value)}
              />

            </div> */}
          {/* </div> */}
          <div className="create-button-container">
            <button className="create-button" type="submit">Update Spot</button>
          </div>
        </form>
      )}
    </>
  )
}

export default UpdateSpot;
