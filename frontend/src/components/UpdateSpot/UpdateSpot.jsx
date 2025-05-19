import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserSpot, getSpotDetails } from '../../store/spots';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateSpot.css'

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [newErrors, setNewErrors] = useState({});
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if(!spotId) return;

    const loadSpot = async () => {
      try {
        const spotData = await dispatch(getSpotDetails(spotId));
        setCountry(spotData.country);
        setAddress(spotData.address);
        setCity(spotData.city);
        setState(spotData.state);
        setDescription(spotData.description);
        setName(spotData.name);
        setPrice(spotData.price);
      } catch (error) {
        console.error('Error loading spot:', error);
      }
    };
    loadSpot();
  }, [dispatch, spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Street address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!description || description.length < 30) newErrors.description = "Description needs 30 or more characters";
    if (!name) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";

    setNewErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const spotDetails = {
        address,
        city,
        state,
        country,
        lat: 45,
        lng: 100,
        name,
        description,
        price
      };

      try {
        const updateSpot = await dispatch(updateUserSpot(spotId, spotDetails));
        if (updateSpot) {
          navigate(`/spots/${updateSpot.id}`)
        }
      } catch(error) {
        console.error('Error updating spot:', error);
      }
  }

};

return (
    <div className='update-spot-title'>
      <div className='title'>
        <span className='update-title'>Update Your Kitchen</span>
        <span className='second-title'>Where&apos;s your kitchen located?</span>
        <span>Guests will only get your exact address once they booked a reservation.</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='location-form'>
          <label>
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              />
          </label>
          {hasSubmitted && !country && <p className="error">{newErrors.country}</p>}
          <label>
            Street Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"/>
          </label>
          {hasSubmitted && !address && <p className="error">{newErrors.address}</p>}

          <div className='city-state'>
            <div>
            <label>
              City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"/>
            </label>
            {hasSubmitted && !city && <p className="error">{newErrors.city}</p>}
            </div>
            <div>
            <label>
              State
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"/>
            </label>
            {hasSubmitted && !state && <p className="error">{newErrors.state}</p>}
            </div>
          </div>
        </div>

        <div className='locationDetails'>
          <label>
            Describe your kitchen to guests
            <p className='detail-description'>
              Mention the best features of your kitchen, any special amenities like fast wifi or parking, and what you love about the neighborhood.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"
              rows="8"/>
          </label>
          {hasSubmitted && !(description.length >= 30) && <p className="error">{newErrors.description}</p>}
        </div>

        <div className='name-section'>
          <label>
            Create a title for your kitchen
            <p className='name-description'>
              Catch guests attention with a kitchen title that highlights what makes your place special.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of your spot"
            />
          </label>
          {hasSubmitted && !name && <p className="error">{newErrors.name}</p>}
        </div>

        <div className='price-section'>
          <label>
            Set a base price for your kitchen
            <p className='price-description'>
              Competitive pricing can help your listing stand out and rank higher in search results.
            </p>
            <div className='price'>
              <span className='price-symbol'>$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per hr (USD)"/>
            </div>
          </label>
          {hasSubmitted && !price && <p className="error">{newErrors.price}</p>}
        </div>

        <div className='update-kitchen-submit-button'>
        <button type="submit" className='update-kitchen-spot-button'>
          Update Kitchen
        </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateSpot;
