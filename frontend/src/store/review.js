import { csrfFetch } from './csrf';

const GET_REVIEWS = '/GET_REVIEWS';
const CREATE_REVIEW = '/CREATE_REVIEW';
const DELETE_REVIEW = '/DELETE_REVIEW';

const loadReviews = (reviews) => ({
  type: GET_REVIEWS,
  reviews: reviews.Reviews
});

const addReview = (review) => ({
  type: CREATE_REVIEW,
  review
});

const removeReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
});


export const getReviews = (spotId) => async (dispatch) => {
  try {
    const reviews = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (reviews.ok) {
      const reviewsData = await reviews.json();
      dispatch(loadReviews(reviewsData));
      return reviewsData;
    }
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const createReview = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        review: reviewData.review,
        stars: reviewData.stars
      })
    });

    if (createReview.ok) {
      const newReview = await createReview.json();
      dispatch(addReview(newReview));
      return newReview;
    }
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const deletion = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
    });

    if (deletion.ok) {
      dispatch(removeReview(reviewId));
      return deletion;
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

const initialState = {
  spot: null
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS: {
      return {
        ...state,
        spot: action.reviews
      };
    }
    case CREATE_REVIEW: {
      return {
        ...state,
        spot: state.spot ? [action.review, ...state.spot] : [action.review]
      };
    }
    case DELETE_REVIEW: {
      return {
        ...state,
        spot: state.spot.filter(review => review.id !== action.reviewId)
      };
    }
    default:
      return state;
  }
};

export default reviewReducer;
