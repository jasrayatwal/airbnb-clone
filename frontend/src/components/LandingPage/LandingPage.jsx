import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import './LandingPage.css'

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => Object.values(state.spots.allSpots || {}));

  console.log(spots);

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
      <div>
        {spots.map(spot => (
          <div key={spot.id}>
            <span>{spot.city}, {spot.state}</span>
            <span> {spot.avgRating}</span>
            <span> ${spot.price}</span>
          </div>
        ))}
      </div>
  );
}

export default LandingPage;
