import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createNewSpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";
// import { getSpotDetails } from "../../store/spots";
import "./CreateSpot.css";

const CreateSpot = () => {
  // console.log("🚀 ~ CreateSpot ~ spot:", spot)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.session.user);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  // const [lat, setLatitude] = useState();
  // const [lng, setLongitude] = useState();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [previewImg, setPreviewImg] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
  const [imageFive, setImageFive] = useState("");

  const [validations, setValidations] = useState({});
  const [hasSubmit, setHasSubmit] = useState(false);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setHasSubmit(true);

    const validationsObj = {};

    !country && (validationsObj.country = "Country is required.");

    !address && (validationsObj.address = "Address is required.");

    !city && (validationsObj.city = "City is required.");

    !state && (validationsObj.state = "State is required.");

    description.length < 30 &&
      (validationsObj.description =
        "Description should be at least 30 characters.");

    !name && (validationsObj.name = "Name is required.");

    !price && (validationsObj.price = "Price is required.");

    !previewImg && (validationsObj.previewImg = "Please add a preview image.");

    setValidations(validationsObj);

    if (Object.keys(validationsObj).length > 0) {
      return;
    }

    const spot = {
      ownerId: currentUser.id,
      country,
      address,
      city,
      state,
      lat: 1,
      lng: 1,
      description,
      name,
      price,
    };

    const newSpotImages = {
      previewImg,
      imageTwo,
      imageThree,
      imageFour,
      imageFive,
    };

    const newSpot = await dispatch(createNewSpot(spot, newSpotImages));
    navigate(`/spots/${newSpot.id}`);
  };

  useEffect(() => {
    !currentUser && navigate("/");
  }, [
    country,
    address,
    city,
    state,
    description,
    name,
    price,
    previewImg,
    currentUser,
    navigate,
  ]);

  return (
    <>
      {currentUser && (
        <form className="create-spot-form" onSubmit={handleOnSubmit}>
          <div className="section-line">
            <h1>Create a New Spot</h1>
            <h3 className="where-located">Where&apos;s your place located?</h3>
            <p className="guests-will-only">
              Guests will only get your exact address once they booked a
              reservation.
            </p>
            <span id="required-field">* Indicates a required field</span>
            <label className="country-address">
              <span>
                * Country{" "}
                {hasSubmit && validations.country && (
                  <span className="validation-message">
                    {validations.country}
                  </span>
                )}{" "}
              </span>
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                // required
              />
            </label>
            <label className="country-address">
              {
                <span>
                  * Street Address{" "}
                  {validations.address && (
                    <span className="validation-message">
                      {validations.address}
                    </span>
                  )}
                </span>
              }
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <div className="city-state-container">
              <label className="city-input">

                <div>* City {validations.city && <span className="validation-message">{validations.city}</span> } </div>
                <input
                  className="city-textbox"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label id="state-input">

                <div id="state-validation-container"><span>* State </span>{validations.state && <span className="validation-message">{validations.state}</span>}</div>
                <span className="comma-separator"> ,</span>
                <input
                  type="text"
                  name="state"
                  placeholder="STATE"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
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
            <h3>* Describe your place to guests</h3>
            {validations.description && <span className="validation-message">{validations.description}</span>}
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
          </div>
          <div className="create-spot-section-3 section-line">
            <h3>* Create a title for your spot</h3>
            <p>
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special.
            </p>
            {validations.name && <span className="validation-message">{validations.name}</span>}
            <input
              className="spot-name-input"
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="create-spot-section-4 section-line">
            <h3>* Set a base price for your spot</h3>
            <p>
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>

            <div id="price-div">
              {validations.price && (
                <span id="price-validation" className="validation-message">
                  {validations.price}
                </span>
              )}
              <div><span>$               <input
                className="price-input"
                type="number"
                placeholder="Price per night (USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              /></span> </div>
            </div>
          </div>

          <div className="create-spot-section-5 section-line">
            <h3 className="liven-up">Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <div className="image-inputs">
              <input
                type="text"
                placeholder="Preview Image URL –– Required"
                value={previewImg}
                onChange={(e) => setPreviewImg(e.target.value)}
              />
              {validations.previewImg && (
                <span className="validation-message">
                  {validations.previewImg}
                </span>
              )}
              <input
                type="text"
                placeholder="Image URL –– Optional"
                value={imageTwo}
                onChange={(e) => setImageTwo(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL –– Optional"
                value={imageThree}
                onChange={(e) => setImageThree(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL –– Optional"
                value={imageFour}
                onChange={(e) => setImageFour(e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL –– Optional"
                value={imageFive}
                onChange={(e) => setImageFive(e.target.value)}
              />
            </div>
          </div>
          <div className="create-button-container">
            <button className="create-button" type="submit">
              Create Spot
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateSpot;
