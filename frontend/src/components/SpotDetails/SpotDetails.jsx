import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotDetails } from '../../store/spots';
import { FaStar } from "react-icons/fa";
import './SpotDetails.css';

const SpotDetails = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const selectedSpot = useSelector(state => state.spots.specificSpot);

  useEffect(() => {
    dispatch(getSpotDetails(id));
  }, [dispatch, id]);

  if (!selectedSpot) return <div>Loading.....</div>;

  function reserveAlert() { return alert('To be done....')}

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
          <button onClick={reserveAlert} className='reserve-button'>Reserve</button>
        </div>
     </div>

    <hr />
  </>
  );
}

export default SpotDetails;
