const express = require('express');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { Op } = require('sequelize');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const review = require('../../db/models/review');

const router = express.Router();

