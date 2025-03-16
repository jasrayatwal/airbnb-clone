const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
    check('firstName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a first name')
    .isLength({ min: 1, max: 30 })
    .withMessage('First Name must be between 1 and 30 characters')
    .matches(/^[A-Za-z0-9]+/)
    .withMessage('First Name must contain at least one letter or number'),
  check('lastName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a last name')
    .isLength({ min: 1, max: 30 })
    .withMessage('Last Name must be between 1 and 30 characters')
    .matches(/^[A-Za-z0-9]+/)
    .withMessage('Last Name must contain at least one letter or number'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;
