import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../../store/review';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import './ReviewDetails.css';

const ReviewDetails = ({spotId}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const selectedSpot = useSelector(state => state.spots.specificSpot);
  const reviews = useSelector(state => state.reviews.spot) || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviewDetails = async () => {
      setIsLoading(true);
      try {
        await dispatch(getReviews(spotId));
      }catch(error){
        console.error('Error loading spot: ', error);
      }finally{
        setIsLoading(false);
      }
    }
    loadReviewDetails();
  }, [dispatch, spotId]);

  if (isLoading) return <div>Loading...</div>;

  const showPostReviewButton = () => {
    if (!user) return false;
    if (selectedSpot?.Owner?.id === user.id) return false;
    if (reviews?.some(review => review.userId === user.id)) return false;
    return true;
  };

if (!selectedSpot) return null;

  return (
    <div className='reviews-section'>
      <div className='review-header'>
        <div className='review-overview'>
          <FaStar className='star'/>
          {selectedSpot.avgRating ? (
            <>
              {selectedSpot.avgRating} <LuDot /> {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </>
          ) : (
            'New'
          )}
        </div>

        {showPostReviewButton() && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReviewModal spotId={spotId} />}
          />
        )}
      </div>

      {reviews.length === 0 ? (
        <p>Be the first to post a review!</p>
      ) : (
        <div className='reviews-list'>
          {[...reviews].reverse().map(review => (
            <div key={review.id} className='review-item'>
              <h4>{review?.User?.firstName}</h4>
              <span className='review-date'>
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <p>{review.review}</p>
              {user?.id === review.userId && (
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default ReviewDetails;
