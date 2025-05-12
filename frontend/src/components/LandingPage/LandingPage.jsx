import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots || {}));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <div className='spots'>
      {spots.map(spot => (
        <div key={spot.id} className='specific-spot'>
          <Link to={`/spots/${spot.id}`}>
            <img src={spot.previewImage} alt={spot.name} />
          </Link>
          <div className='spot-info'>
            <div className='spot-rating'>
              <span className='city-state'>{spot.city}, {spot.state}</span>
              <span className='rating'><FaStar /> {4.5}</span>
            </div>
            <p className='price'>
              <span>${spot.price}</span> night
            </p>
          </div>
        </div>
      ))}
    </div>
);
}

export default LandingPage;
