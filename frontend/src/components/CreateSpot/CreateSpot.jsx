import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createNewSpot } from "../../store/spots";
import { useNavigate } from 'react-router-dom';
import { getSpotDetails } from "../../store/spots";
import './CreateSpot.css'

const CreateSpot = () => {
  // console.log("🚀 ~ CreateSpot ~ spot:", spot)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(state => state.session.user)
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLatitude] = useState();
  const [lng, setLongitude] = useState();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const [previewImg, setPreviewImg] = useState('');
  const [imageTwo, setImageTwo] = useState('');
  const [imageThree, setImageThree] = useState('');
  const [imageFour, setImageFour] = useState('');
  const [imageFive, setImageFive] = useState('');

  const [validations, setValidations] = useState({});

  useEffect(() => {
    setLatitude();
    setLongitude();
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

    description.length < 30 && (
      validationsObj.description = 'Description should be at least 30 characters.'
    )

    !name && (
      validationsObj.name = 'Name is required.'
    )

    !price && (
      validationsObj.price = 'Price is required.'
    )

    !previewImg && (
      validationsObj.previewImg = 'Please add a preview image.'
    )

    setValidations(validationsObj)
  }, [country, address, city, state, description, name, price, previewImg, currentUser, navigate])

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const spot = {
      ownerId: currentUser.id,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    }

    const newSpotImages = {
      previewImg,
      imageTwo,
      imageThree,
      imageFour,
      imageFive
    }

    const newSpot = await dispatch(createNewSpot(spot, newSpotImages));
    console.log("🚀 ~ handleOnSubmit ~ newSpot:", newSpot)
    dispatch(getSpotDetails(newSpot))
    navigate(`/spots/${newSpot.id}`)
  }

  return (
    <>
      <h1>Create a New Spot</h1>
      <section>
        <form className="create-spot-form" onSubmit={handleOnSubmit}>
          <section className="create-spot-section-1">
            <h3>Where&apos;s your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <label htmlFor="country">
              Country
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                 />
            </label>
            {validations.country && <span className="validation-message">{validations.country}</span>}
            <label htmlFor="address">
              Street Address
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                 />
                 {validations.address && <span className="validation-message">{validations.address}</span>}
            </label>
            <label htmlFor="city">
              City
              <input
                type="text"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                 />
                 {validations.city && <span className="validation-message">{validations.city}</span>}
            </label>
            <label htmlFor="state">
              State
              <input
                type="text"
                name="state"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                 />
                 {validations.state && <span className="validation-message">{validations.state}</span>}
            </label>
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
          </section>
          <section className="create-spot-section-2">
              <h3>Describe your place to guests</h3>
              <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
              <textarea
                placeholder="Please write at least 30 characters"
                cols="45"
                rows="8"
                minLength={30}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                 >
                </textarea>
                {validations.description && <span className="validation-message">{validations.description}</span>}
          </section>
          <section className="create-spot-section-3">
            <h3>Create a tile for your spot</h3>
            <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
            <input
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)} />
          </section>
          {validations.name && <span className="validation-message">{validations.name}</span>}
          <section className="create-spot-section-4">
            <h3>Set a base price for your spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <input
              type="number"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)} />
          </section>
          {validations.price && <span className="validation-message">{validations.price}</span>}
          <section className="create-spot-section-5">
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
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
              onChange={(e) => setImageTwo(e.target.value)} />
            <input
              type="text"
              placeholder="Image URL"
              value={imageThree}
              onChange={(e) => setImageThree(e.target.value)} />
            <input
              type="text"
              placeholder="Image URL"
              value={imageFour}
              onChange={(e) => setImageFour(e.target.value)} />
            <input
              type="text"
              placeholder="Image URL"
              value={imageFive}
              onChange={(e) => setImageFive(e.target.value)} />
          </section>
          <button type="submit">Create Spot</button>
        </form>
      </section>
    </>
  )
}

export default CreateSpot;
