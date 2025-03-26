const express = require('express');
const { User, Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];


const validateQueryFilters = [
  check('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be greater than or equal to 1'),
  check('size')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Size must be between 1 and 20'),
  check('minLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Minimum latitude is invalid'),
  check('maxLat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Maximum latitude is invalid'),
  check('minLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Minimum longitude is invalid'),
  check('maxLng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Maximum longitude is invalid'),
  check('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

//get all Spots
router.get('/', async(req, res, next) => {
  try{
    const spots = await Spot.findAll({
      include: {
        model: SpotImage,
        attributes: ['url'],
        required: false,
      }
    });

    const formattedSpots = spots.map(spot => {
      const spotData = spot.toJSON();
      return {
        id: spotData.id,
        ownerId: spotData.ownerId,
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: spotData.lat,
        lng: spotData.lng,
        name: spotData.name,
        description: spotData.description,
        price: spotData.price,
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt,
        avgRating: null, // Will be implemented with Reviews
        previewImage: spotData.SpotImages[0]?.url || null
      };
    });

    return res.status(200).json({Spots: formattedSpots});
  } catch(error){
      next(error);
  }

});

//get all spots owned by the current user)
router.get('/current', requireAuth, async (req, res, next) => {
  const user = req.user.id;
  try {
    const userSpots = await Spot.findAll({
      where: {
        ownerId: user
      },
      include: {
        model: SpotImage,
        attributes: ['url'],
        required: false,
      }
    });

    const formattedSpots = userSpots.map(spot => {
      const spotData = spot.toJSON();
      return {
        id: spotData.id,
        ownerId: spotData.ownerId,
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: spotData.lat,
        lng: spotData.lng,
        name: spotData.name,
        description: spotData.description,
        price: spotData.price,
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt,
        avgRating: null, // Will be implemented with Reviews
        previewImage: spotData.SpotImages[0]?.url || null
      };
    });

    return res.status(200).json({Spots: formattedSpots});
  } catch (error){
    next(error);
  }
});

//get spot by specific id
router.get('/:id', async(req, res, next) => {
  try {
    const specificSpot = await Spot.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if(!specificSpot){
      const err = new Error(`Spot ${req.params.id} can not be found `);
      err.status = 404;
      return next(err);
    }

    //To be implemented with Reviews
    specificSpot.numReviews = null;
    specificSpot.avgStarRating = null;

    return res.status(200).json(specificSpot);
  } catch(error){
    next(error);
  }
})

//add a spot
router.post('/', requireAuth, validateSpot, async(req, res) => {
  const spotData = {
    ownerId: req.user.id, //user posting spot
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    lat: req.body.lat,
    lng: req.body.lng,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  }
  try{
    const newSpot = await Spot.create(spotData);

    return res.status(201).json(newSpot);
  } catch(error){
      next(error); //validation 400 status?
  }
});

//add an image to a spot based on the Spot's ID
router.post('/:id/images', requireAuth, async (req, res, next) => {

  try {
    const spot = await Spot.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if(spot.ownerId !== req.user.id){
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    const {url, preview} = req.body;
    const newImage = await SpotImage.create({
      spotId: spot.id,
      url,
      preview
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview
    });

  } catch(error){
    next(error);
  }
});

//edit a spot
router.put('/:id', requireAuth, async(req, res, next) => {
  try {
    const spot = await Spot.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if(spot.ownerId !== req.user.id){
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    spot.set({
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      lat: req.body.lat,
      lng: req.body.lng,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    })

    await spot.save();

    res.status(200).send(spot);

  }catch(error){
    next(error);
  }
});

//delete a spot
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if(spot.ownerId !== req.user.id){
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await spot.destroy();

    return res.status(200).json({
      message: "Successfully deleted"
    });

  }catch(error){
    next(error);
  }
});

module.exports = router;
