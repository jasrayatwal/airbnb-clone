import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteReview } from '../../store/review';
import { getSpotDetails } from '../../store/spots';
import { getReviews } from '../../store/review';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId));
      await dispatch(getSpotDetails(spotId));
      await dispatch(getReviews(spotId));
      closeModal();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="deleteReview-modal">
      <span className='title'>Confirm Delete</span>
      <div className='delete-message'>Are you sure you want to delete this review?</div>
      <div className="all-buttons">
        <button
          className="delete-button"
          onClick={handleDelete}
        >
          Yes (Delete Review)
        </button>
        <button
          className="cancel-button"
          onClick={closeModal}
        >
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
