import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSpots } from '../../store/spots';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './ManageKitchens.css';

const ManageKitchens = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector(state => Object.values(state.spots.userSpots || {}));

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  if (!userSpots.length) {
    return (
      <div className='all-kitchens'>
        <h1>Manage Kitchens</h1>
        <NavLink to="/spots/new" className="create-kitchen">
          Create a New Kitchen
        </NavLink>
        <p className='no-kitchens'>No kitchens yet!</p>
      </div>
    );
  }

  return (
    <div className='all-kitchens'>
      <h1 className='manage-kitchen-title'>Manage Kitchens</h1>
      <NavLink to="/spots/new" className="create-kitchen">Create a New Kitchen</NavLink>

      <div className='spots-grid'>
        {userSpots.map(spot => (
          <div key={spot.id} className='spot-tile'>
            <div className='spot-content' onClick={() => navigate(`/spots/${spot.id}`)}>
              <img
                src={spot.previewImage}
                alt={spot.name}
              />
              <div className='spot-info'>
                <div className='location-rating'>
                  <span>{spot.city}, {spot.state}</span>
                  <span className='rating'>
                    <FaStar className='star' /> {spot.avgRating || 'New'}
                  </span>
                </div>
                <span className='price'>${spot.price} night</span>
              </div>
            </div>
            <div className='manage-buttons'>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(spot.id);
                }}
                className='update-button'
              >
                Update
              </button>
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageKitchens;
