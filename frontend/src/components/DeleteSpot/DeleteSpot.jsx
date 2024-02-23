import { useModal } from "../../context/Modal";
import { useDispatch} from "react-redux";
import { deleteSpotThunk } from "../../store/spots";

const DeleteSpot = ({ spotId }) => {
  // const spotid = useSelector(state => console.log('this is the state at deleteSpot', state))
  // console.log("🚀 ~ DeleteSpot ~ spotid:", spotid)
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDeleteOnSubmit = async (e) => {
    e.preventDefault()

    await dispatch(deleteSpotThunk(spotId))
    closeModal();
  }

  return (
    <form className="delete-spot-form" onSubmit={handleDeleteOnSubmit}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <section>
        <button type="submit">Yes (Delete Spot)</button>
        <button onClick={() => closeModal()}>No (Keep Spot)</button>
      </section>
    </form>
  )
}

export default DeleteSpot;
