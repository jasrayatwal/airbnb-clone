const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage, sequelize} = require('../../db/models');
const { Op } = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

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
    .custom((value) => {
      if (value && (parseInt(value) < 1)) {
        throw new Error('Page must be greater than or equal to 1');
      }
      return true;
    }),
  check('size')
    .optional()
    .custom((value) => {
      if (value && (parseInt(value) < 1 || parseInt(value) > 20)) {
        throw new Error('Size must be between 1 and 20');
      }
      return true;
    }),
  check('minLat')
    .optional()
    .custom((value) => {
      if (value && (parseFloat(value) < -90 || parseFloat(value) > 90)) {
        throw new Error('Minimum latitude is invalid');
      }
      return true;
    }),
  check('maxLat')
    .optional()
    .custom((value) => {
      if (value && (parseFloat(value) < -90 || parseFloat(value) > 90)) {
        throw new Error('Maximum latitude is invalid');
      }
      return true;
    }),
  check('minLng')
    .optional()
    .custom((value) => {
      if (value && (parseFloat(value) < -180 || parseFloat(value) > 180)) {
        throw new Error('Minimum longitude is invalid');
      }
      return true;
    }),
  check('maxLng')
    .optional()
    .custom((value) => {
      if (value && (parseFloat(value) < -180 || parseFloat(value) > 180)) {
        throw new Error('Maximum longitude is invalid');
      }
      return true;
    }),
  check('minPrice')
    .optional()
    .custom((value) => {
      if (value && parseFloat(value) < 0) {
        throw new Error('Minimum price must be greater than or equal to 0');
      }
      return true;
    }),
  check('maxPrice')
    .optional()
    .custom((value) => {
      if (value && parseFloat(value) < 0) {
        throw new Error('Maximum price must be greater than or equal to 0');
      }
      return true;
    }),
  handleValidationErrors
];

//get all Spots
router.get('/', validateQueryFilters, async(req, res, next) => {
  try{
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = page ? parseInt(page) : 1;
    size = size ? parseInt(size) : 20;

    const where = {};

    if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

    const spots = await Spot.findAll({
      include: [
      {
        model: SpotImage,
        attributes: ['url'],
        required: false,
      },
      {
        model: Review,
        attributes: [],
        required: false,
      }],
      /*
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT ROUND(COALESCE(AVG(stars), 0), 1)
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"
            )`),
            'avgRating'
          ]
        ]
      },
      */
      limit: size,
      offset: size * (page - 1)
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
        avgRating: spotData.avgRating || null,
        previewImage: spotData.SpotImages[0]?.url || null
      };
    });

    return res.status(200).json({Spots: formattedSpots, page, size});
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
      include: [
        {
          model: SpotImage,
          attributes: ['url'],
          required: false,
        },
        {
          model: Review,
          attributes: [],
          required: false,
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT ROUND(COALESCE(AVG(stars), 0), 1)
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"
            )`),
            'avgRating'
          ]
        ]
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
        avgRating: spotData.avgRating || null,
        previewImage: spotData.SpotImages[0]?.url || null
      };
    });

    return res.status(200).json({Spots: formattedSpots});
  } catch (error){
    next(error);
  }
});

router.get('/:spotId/reviews', async (req, res, next) => {
  try {
    const spot = await Spot.findOne({
      where: {
        id: req.params.spotId
      }
    });

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    res.json({ Reviews: reviews });

  } catch (error) {
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
        },
        {
          model: Review,
          attributes: [],
          required: false
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"
            )`),
            'numReviews'
          ],
          [
            sequelize.literal(`(
              SELECT ROUND(COALESCE(AVG(stars), 0), 1)
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"
            )`),
            'avgStarRating'
          ]
        ]
      }
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
      next(error);
  }
});

//create a review for a spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  try {
    const spot = await Spot.findOne({
      where: {
        id: req.params.spotId
      }
    });

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    // Check if user already has a review for this spot
    const existingReview = await Review.findOne({
      where: {
        spotId: spot.id,
        userId: req.user.id
      }
    });

    if (existingReview) {
      const err = new Error("User already has a review for this spot");
      err.status = 500;
      return next(err);
    }

    const newReview = await Review.create({
      userId: req.user.id,
      spotId: spot.id,
      review: req.body.review,
      stars: req.body.stars
    });

    res.status(201).json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt
    });

  } catch (error) {
    next(error);
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
