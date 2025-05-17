import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotDetails } from '../../store/spots';
import { FaStar } from "react-icons/fa";
import './SpotDetails.css';

const SpotDetails = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const selectedSpot = useSelector(state => state.spots.specificSpot);
  const [isLoading, setIsLoading] = useState(true);

  /*
  useEffect(() => {
    dispatch(getSpotDetails(id))
  }, [dispatch, id]);
  */

  useEffect(() => {
    const loadSpotDetails = async () => {
      setIsLoading(true);
      try {
        await dispatch(getSpotDetails(id));
      } catch (error) {
        console.error('Error loading spot:', error);
      } finally {
        setIsLoading(false);
      }
    };

      loadSpotDetails();
  }, [dispatch, id]);

  function reserveAlert() { return alert('Feature coming soon')}

  if (isLoading) return <div>Loading...</div>;
  if (!selectedSpot) return <div>Spot not found</div>;

  return (
  <>
    <div className='spot-details'>
      <div className='spot-name'>{selectedSpot.name}</div>
      <div className='spot-location'>{selectedSpot.city}, {selectedSpot.state},   {selectedSpot.country}</div>
    </div>

    <div className='spot-images'>
      {selectedSpot.SpotImages?.map(img => (
        <img key= {img.id} src={img.url} alt="" />
      ))}
    </div>

    <div className='details-reserve'>
          <div className='owner-details'>
          <span>Hosted by {selectedSpot.Owner.firstName} {selectedSpot.Owner.lastName}</span>
          <p>{selectedSpot.description}</p>
          </div>

        <div className='reserve-section'>
          <div className='reserve-info'>
            <span className='reserve-price'>${selectedSpot.price} night</span>
            <span className='reserve-star'><FaStar/> {selectedSpot.Review ? selectedSpot.Review : 'New'}</span>
          </div>
          <button onClick={reserveAlert}className='reserve-button'>Reserve</button>
        </div>
     </div>

    <hr />
  </>
  );
}

export default SpotDetails;
