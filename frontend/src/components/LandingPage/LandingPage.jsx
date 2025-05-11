import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots || {}));

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!spots.length) return <div>Loading...</div>;

  return (
      <div>
        {spots.map(spot => (
          <div key={spot.id}>
            <img src={spot.previewImage} alt="" />
            <span>{spot.city}, {spot.state}</span>
            <span> {spot.avgRating}</span>
            <span> ${spot.price}</span>
          </div>
        ))}
      </div>
  );
}

export default LandingPage;
