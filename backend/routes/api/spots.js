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
  //implement
  check('page')
    .isInt({min: 1})
    .withMessage('Page must be at least 1'),
  check('size')
    .isInt({min: 1, max: 20})
    .withMessage('Size must be at least 1 and less than 20'),
  check('minPrice')
    .isFloat({ min: 0})
    .withMessage('Min price must be at least 0'),
  check('maxPrice')
    .isFloat( { min: 0})
    .withMessage('Max price must be at least 0'),
  handleValidationErrors
];


router.get('/', async(req, res) => {
  const spots = await Spot.findAll();
  return res.json({Spots: spots});
});

module.exports = router;
