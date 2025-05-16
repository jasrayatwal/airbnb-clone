import { useState, useEffect } from 'react';
//import { useDispatch } from 'react-redux';
//import { makeNewSpot } from '../../store/spots';
import './NewSpot.css'

const NewSpot = () => {
  //const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    return () => {
      setCountry('');
      setAddress('');
      setCity('');
      setState('');
      setDescription('');
      setTitle('');
      setPrice('');
      setErrors({});
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const locationData = {
      address,
      city,
      state,
      country
    };

    const locationDetails = {
      description,
      title,
      price
    }

    console.log("Form Data:", locationData, locationDetails);
    // We'll handle the submission later
  };

return (
    <div className='create-spot-title'>
      <div className='title'>
        <span>Create a new Kitchen!</span>
        <span>Where&apos;s your kitchen located?</span>
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
              required/>
          </label>
          {errors.country && <p className="error">{errors.country}</p>}

          <label>
            Street Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              required/>
          </label>
          {errors.address && <p className="error">{errors.address}</p>}

          <div className='city-state'>
            <label>
              City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                required/>
            </label>
            {errors.city && <p className="error">{errors.city}</p>}

            <label>
              State
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                required/>
            </label>
            {errors.state && <p className="error">{errors.state}</p>}
          </div>
        </div>
        <div className='locationDetails'>
          <label>
            Describe your place to guests
            <p className='detail-description'>
              Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description - At least 30 characters"
              rows="8"
              minLength="30"
              required/>
          </label>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className='price-section'>
          <label>
            Set a base price for your spot
            <p className='price-description'>
              Competitive pricing can help your listing stand out and rank higher in search results.
            </p>
            <div className='price'>
              <span className='price-symbol'>$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                min="1"
                step="0.01"
                required/>
            </div>
          </label>
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
      </form>
    </div>
  );
}

export default NewSpot;
