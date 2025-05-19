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
      {[...spots].reverse().map(spot => (
        <Link key={spot.id} to={`/spots/${spot.id}`} className='link'>
        <div key={spot.id} className='specific-spot' title={spot.name}>
            <img src={spot.previewImage} alt={spot.name} />
          <div className='spot-info'>
            <div className='spot-rating'>
              <span className='city-state'>{spot.city}, {spot.state}</span>
              <span className='rating'><FaStar className='star' /> {spot.avgRating}</span>
            </div>
              <div className='spot-price'>${spot.price} per hr</div>
          </div>
        </div>
        </Link>
      ))}
    </div>
);
}

export default LandingPage;
