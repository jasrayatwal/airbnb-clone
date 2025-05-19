import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteUserSpot } from '../../store/spots';
import './DeleteSpotModal.css';

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteUserSpot(spotId));
      closeModal();
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
  };

  return (
    <div className="deleteSpot-modal">
      <div className='title'>Confirm Delete</div>
      <div className='delete-message'>Are you sure you want to remove this kitchen from the listings?</div>
      <div className="all-buttons">
        <button
          className="delete-button"
          onClick={handleDelete}
        >
          Yes (Delete Spot)
        </button>
        <button
          className="cancel-button"
          onClick={closeModal}
        >
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
