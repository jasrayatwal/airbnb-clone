import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import { FaStar } from "react-icons/fa";
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots || {}));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!spots.length) return <div>Loading...</div>;

  return (
      <div className='spots'>
        {spots.map(spot => (
          <div key={spot.id} className='specific-spot'>
            <img src={spot.previewImage} alt="" />
            <div className='city-state'>{spot.city}, {spot.state}</div>
            <div className='price'> <b>${spot.price}</b> night</div>
            <div className='rating'><FaStar/> 4.5</div> {/*{spot.avgRating}*/}
          </div>
        ))}
      </div>
  );
}

export default LandingPage;
