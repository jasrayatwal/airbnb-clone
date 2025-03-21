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
    const spots = await Spot.findAll();
    return res.status(200).json({Spots: spots});
  } catch(error){
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
    });

    if(!specificSpot){
      const err = new Error(`Spot ${req.params.id} can not be found `);
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(specificSpot);
  } catch(error){
    next(error);
  }
})

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
      next(error);
  }
});

module.exports = router;
