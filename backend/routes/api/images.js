const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/spot-images/:imageId', requireAuth, async (req, res, next) => {
  try {
    const spotImage = await SpotImage.findOne({
      where: {id: req.params.imageId},
      include: [{
        model: Spot,
        attributes: ['ownerId']
      }]
    });

    if(!spotImage){
      const err = new Error("Spot image could not be found");
      err.status = 404;
      return next(err);
    }

    if(spotImage.Spot.ownerId !== req.user.id){
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await spotImage.destroy();
    res.status(200).json({message: 'Successfully deleted'});

  } catch(error){
    next(error);
  }
});

router.delete('/review-images/:imageId', requireAuth, async (req, res, next) => {
  try {
    const reviewImage = await ReviewImage.findOne({
      where: {id: req.params.imageId},
      include: [{
        model: Review,
        attributes: ['userId']
      }]
    });

    if(!reviewImage){
      const err = new Error("Review image could not be found");
      err.status = 404;
      return next(err);
    }

    if(reviewImage.Review.userId !== req.user.id){
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    await reviewImage.destroy();
    res.status(200).json({message: 'Successfully deleted'});

  } catch(error){
    next(error);
  }
});

module.exports = router;
