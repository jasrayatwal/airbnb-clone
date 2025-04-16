const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const review = require('../../db/models/review');

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


//get all reviews of the current user
router.get('/current', requireAuth, async (req, res, next) => {
  const user = req.user.id;

  try{
    const reviews = await Review.findAll({
      where: {
        userId: user
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'price',
          ],
          include: [{
            model: SpotImage,
            attributes: ['url']
          }]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    const formattedReviews = reviews.map(review => {
      const reviewData = review.toJSON();
      const formattedSpot = {
        ...reviewData.Spot,
        previewImage: reviewData.Spot.SpotImages?.[0]?.url || null
      };
      delete formattedSpot.SpotImages;
      return {
        ...reviewData,
        Spot: formattedSpot,
        ReviewImages: reviewData.ReviewImages || []
      };
    });

    res.status(200).json({ Reviews: formattedReviews });

  } catch(error){
    next(error);
  }
});

//add a review for a spot based on the spot's id
router.post('/:id', requireAuth, validateReview, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

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

  }catch(error){
    next(error);
  }
});
//add image to a review
router.post('/:id/images', requireAuth, async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);


    if (!review) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }


    if (review.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }


    const imageCount = await ReviewImage.count({
      where: { reviewId: req.params.id }
    });

    if (imageCount >= 10) {
      const err = new Error("Maximum number of images for this resource was reached");
      err.status = 403;
      return next(err);
    }


    const { url } = req.body;
    const newImage = await ReviewImage.create({
      reviewId: review.id,
      url
    });


    return res.status(201).json({
      id: newImage.id,
      url: newImage.url
    });

  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, validateReview, async(req, res, next) => {
  try {
    const reviewToEdit = await Review.findByPk(req.params.id);

    if (!reviewToEdit) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (reviewToEdit.userId !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    reviewToEdit.set({
      review: req.body.review,
      stars: req.body.stars
    })

    await reviewToEdit.save();

    res.status(200).json({
      id: reviewToEdit.id,
      userId: reviewToEdit.userId,
      spotId: reviewToEdit.spotId,
      review: reviewToEdit.review,
      stars: reviewToEdit.stars,
      createdAt: reviewToEdit.createdAt,
      updatedAt: reviewToEdit.updatedAt
    });

  } catch(error)  {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id
      }
    });

    if(!review) {
      const err = new Error("review couldn't be found");
      err.status = 404;
      return next(err);
    }

    if(review.userId !== req.user.id){
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await review.destroy();

    return res.status(200).json({
      message: "Successfully deleted"
    });

  }catch(error){
    next(error);
  }
});

module.exports = router;
