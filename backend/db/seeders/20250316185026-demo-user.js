'use strict';

const { User, Spot, Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'User'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Fake',
        lastName: 'One'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Fake',
        lastName: 'Two'
      },
      {
        email: 'user3@user.io',
        username: 'firstaatester',
        hashedPassword: bcrypt.hashSync('secret password'),
        firstName: 'Fake',
        lastName: 'Three'
      }
    ], { validate: true });

    await Spot.bulkCreate([
      {
        ownerId: users[0].id,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123
      },
      {
        ownerId: users[1].id,
        address: '95 3rd St',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7866019,
        lng: -122.4028268,
        name: 'App Academy',
        description: 'Coding Bootcamp',
        price: 500
      }
    ], { validate: true });

    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "It was great, parking was tough.",
        stars: 4
      },
      {
        spotId: 1,
        userId: 3,
        review: "Unique but a lot of noise.",
        stars: 3
      },
      {
        spotId: 2,
        userId: 1,
        review: "Great location.",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "modern setup but wifi was not great.",
        stars: 4
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);

    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options);

    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
