import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { makeNewSpot } from '../../store/spots';
import { useNavigate } from 'react-router-dom';
import './NewSpot.css'

const NewSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [newErrors, setNewErrors] = useState({});
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState(['', '', '', '', '']);

  useEffect(() => {
    return () => {
      setCountry('');
      setAddress('');
      setCity('');
      setState('');
      setDescription('');
      setName('');
      setPrice('');
      setPreviewImage([]);
      setNewErrors({});
      setHasSubmitted(false);
    };
  }, []);

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
    if (!previewImage[0]) newErrors.previewImage = "Preview image is required";

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
        price,
        previewImage
      };

      try {
        const createSpot = await dispatch(makeNewSpot(spotDetails));
        if (createSpot) {
          navigate(`/spots/${createSpot.id}`)
        }
      } catch(error) {
        console.error('Error creating spot:', error);
      }
  }
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
            <label>
              City
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"/>
            </label>
            {hasSubmitted && !city && <p className="error">{newErrors.city}</p>}

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

        <div className='locationDetails'>
          <label>
            Describe your place to guests
            <p className='detail-description'>
              Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
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
            Create a title for your spot
            <p className='name-description'>
              Catch guests attention with a spot title that highlights what makes your place special.
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
                placeholder="Price per night (USD)"/>
            </div>
          </label>
          {hasSubmitted && !price && <p className="error">{newErrors.price}</p>}
        </div>

        <div className='photos-section'>
          <label>
            Liven up your spot with photos
          <p className='photos-description'>
            Submit a link to at least one photo to publish your spot.
          </p>
          <input
            type="text"
            value={previewImage[0]}
            onChange={(e) => {
            const updatedImages = [...previewImage];
            updatedImages[0] = e.target.value;
            setPreviewImage(updatedImages);
            }}
            placeholder="Preview Image URL"
          />
          <input
            type="text"
            value={previewImage[1]}
            onChange={(e) => {
            const updatedImages = [...previewImage];
            updatedImages[1] = e.target.value;
            setPreviewImage(updatedImages);
            }}
            placeholder="Image URL"
          />
          <input
            type="text"
            value={previewImage[2]}
            onChange={(e) => {
            const updatedImages = [...previewImage];
            updatedImages[2] = e.target.value;
            setPreviewImage(updatedImages);
            }}
            placeholder="Image URL"
          />
          <input
            type="text"
            value={previewImage[3]}
            onChange={(e) => {
            const updatedImages = [...previewImage];
            updatedImages[3] = e.target.value;
            setPreviewImage(updatedImages);
            }}
            placeholder="Image URL"
          />
          <input
            type="text"
            value={previewImage[4]}
            onChange={(e) => {
            const updatedImages = [...previewImage];
            updatedImages[4] = e.target.value;
            setPreviewImage(updatedImages);
            }}
            placeholder="Image URL"
          />
          </label>
          {hasSubmitted && !previewImage[0] && <p className="error">{newErrors.previewImage}</p>}
        </div>

        <div className='submit-button-container'>
        <button type="submit" className='create-spot-button'>
          Create Spot
        </button>
        </div>
      </form>
    </div>
  );
}

export default NewSpot;
