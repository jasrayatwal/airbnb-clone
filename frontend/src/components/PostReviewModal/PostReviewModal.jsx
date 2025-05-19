import { useModal } from '../../context/Modal';
import { createReview, getReviews } from '../../store/review';
import { getSpotDetails } from '../../store/spots';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import './PostReviewModal.css';

function PostReviewModal({spotId}) {
  const dispatch = useDispatch();
  const [reviewDescription, setReviewDescription] = useState('');
  const [stars, setStars] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        review: reviewDescription,
        stars: Number(stars)
      };

      await dispatch(createReview(spotId, reviewData));
      await dispatch(getSpotDetails(spotId));
      await dispatch(getReviews(spotId));
      closeModal();
    } catch (error) {
      const data = await error.json();
      if (data?.errors) {
        setErrors(data.errors);
      }
    }
  };

  const hideSubmitButton = reviewDescription.length < 10 || stars === 0;

  const renderedStars = Array(5).fill(0);

  const colors = {
        orange: "#F2C265",
        grey: "a9a9a9"
  }

  const handleClickStar = value => {
    setStars(value)
  }

  const handleMouseOverStar = value => {
    setHoverValue(value)
  }

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined)
  }

  return (
    <div className='reviewModal'>
      <span className='reviewModal-title'>How was your stay?</span>
      {Object.values(errors).map((error, index) => (
        <p key={index} className='backend-errors'>{error}</p>
      ))}
      <form onSubmit={handleSubmit}>
      <textarea className='reviewModal-textbox'
        placeholder='Leave your review here...'
        value={reviewDescription}
        onChange={(e) => setReviewDescription(e.target.value)}
      />

      <div className='reviewModal-stars'>
        {renderedStars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              color={(hoverValue || stars) > index ? colors.orange : colors.grey}
              onClick={() => handleClickStar(index + 1)}
              onMouseOver={() => handleMouseOverStar(index + 1)}
              onMouseLeave={handleMouseLeaveStar}
            />
          )
        })}
        <span className='stars-text'>Stars</span>
      </div>

      <button
        type='submit'
        className='submit-button'
        disabled={hideSubmitButton}
      >
        Submit Your Review
      </button>
    </form>
    </div>
  );
}

export default PostReviewModal;
