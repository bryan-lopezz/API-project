import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createNewSpot } from "../../store/spots";

const CreateSpot = () => {
  const dispatch = useDispatch();

  const [ownerId, setOwnerId] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLatitude] = useState(0);
  const [lng, setLongitude] = useState(0);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [imageTwo, setImageTwo] = useState('');
  const [imageThree, setImageThree] = useState('');
  const [imageFour, setImageFour] = useState('');
  const [imageFive, setImageFive] = useState('');

  const currentUserId = useSelector(state => state.session.user.id)

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const spot = {
      ownerId: currentUserId,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImg,
      imageTwo,
      imageThree,
      imageFour,
      imageFive
    }
    const newSpot = await dispatch(createNewSpot(spot))

    if(!newSpot) return;

  }

  return (
    <>
      <h1>Create a New Spot</h1>
      <section>
        <form className="create-spot-form" onSubmit={handleOnSubmit}>
          <section className="create-spot-section-1">
            <label htmlFor="country">
              Country
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required />
            </label>
            <label htmlFor="address">
              Street Address
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required />
            </label>
            <label htmlFor="city">
              City
              <input
                type="text"
                name="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required />
            </label>
            <label htmlFor="state">
              State
              <input
                type="text"
                name="state"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required />
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}>
                </textarea>
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
          <section className="create-spot-section-4">
            <h3>Set a base price for your spot</h3>
            <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
            <input
              type="number"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)} />
          </section>
          <section className="create-spot-section-5">
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <input
              type="text"
              placeholder="Preview Image URL"
              value={previewImg}
              onChange={(e) => setPreviewImg(e.target.value)} />
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
