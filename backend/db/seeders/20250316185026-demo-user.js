'use strict';

const { User, Spot, Review, SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
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
        firstName: 'First',
        lastName: 'Fake'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Test',
        lastName: 'Tester'
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('secret password'),
        firstName: 'Random',
        lastName: 'User'
      }
    ], { validate: true });

    options.tableName = 'Spots';
    await Spot.bulkCreate([
      {
        ownerId: users[0].id,
        address: '8064 Brewerton Rd',
        city: 'Cicero',
        state: 'New York',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'Kitchen One',
        description: 'Place where great food is made.',
        price: 25
      },
      {
        ownerId: users[0].id,
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'Illinois',
        country: 'United States of America',
        lat: 37.7866019,
        lng: -122.4028268,
        name: 'Kitchen Two',
        description: 'Another place where great food is made.',
        price: 50.50
      },
      {
        ownerId: users[1].id,
        address: '159 Maplewood Drive',
        city: 'Ashford',
        state: 'Kentucky',
        country: 'United States of America',
        lat: 37.7866019,
        lng: -122.4028268,
        name: 'Kitchen Three',
        description: 'Make yourself feel like home while cooking here.',
        price: 35.35
      },
      {
        ownerId: users[1].id,
        address: '418 Oakridge Lane',
        city: 'Lakeside',
        state: 'Oregon',
        country: 'United States of America',
        lat: 37.7866019,
        lng: -122.4028268,
        name: 'Kitchen Four',
        description: 'Why not cook with beautiful views while you make your meals.',
        price: 125.25
      },
      {
        ownerId: users[2].id,
        address: '89 Cedar Point Avenue',
        city: 'Fairview',
        state: 'Texas',
        country: 'United States of America',
        lat: 37.7866019,
        lng: -122.4028268,
        name: 'Kitchen Five',
        description: 'Just another place to make your meal with the basics.',
        price: 10.01
      },
      {
        ownerId: users[3].id,
        address: '305 Birchwood Circle',
        city: 'Hillsborough',
        state: 'New Jersey',
        country: 'United States of America',
        lat: 37.7866019,
        lng: -122.4028268,
        name: 'Kitchen Six',
        description: 'No other kitchen matches, with all the special toold you will ever need.',
        price: 150
      }
    ], { validate: true });

    options.tableName = 'SpotImages';
    await SpotImage.bulkCreate([
      {
        spotId:1,
        url: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg",
        preview: true
      }, {
        spotId:1,
        url: "https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg",
        preview: false
      },
      {
        spotId:1,
        url: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
        preview: false
      },
      {
        spotId:1,
        url: "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg",
        preview: false
      },
      {
        spotId:1,
        url: "https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg",
        preview: false
      },
      {
        spotId:2,
        url: "https://images.pexels.com/photos/2398375/pexels-photo-2398375.jpeg",
        preview: true
      }, {
        spotId:2,
        url: "https://images.pexels.com/photos/2098912/pexels-photo-2098912.jpeg",
        preview: false
      }, {
        spotId:2,
        url: "https://images.pexels.com/photos/94865/pexels-photo-94865.jpeg",
        preview: false
      }, {
        spotId:3,
        url: "https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg",
        preview: true
      }, {
        spotId:4,
        url: "https://images.pexels.com/photos/2098912/pexels-photo-2098912.jpeg",
        preview: true
      }, {
        spotId:4,
        url: "https://images.pexels.com/photos/1103559/pexels-photo-1103559.jpeg",
        preview: false
      }, {
        spotId:5,
        url: "https://images.pexels.com/photos/2001944/pexels-photo-2001944.jpeg",
        preview: true
      }, {
        spotId:6,
        url: "https://images.pexels.com/photos/5824485/pexels-photo-5824485.jpeg",
        preview: true
      }
    ], {validate: true});

    options.tableName = 'Reviews';
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "Awesome kitchen! Has everything you need, but wish it had a few more tools.",
        stars: 5
      },
      {
        spotId: 1,
        userId: 1,
        review: "It was great, parking was tough.",
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: "Basic and not noteworthy but works.",
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: "Equipment was not working, not as spacious as the pictures seem.",
        stars: 1
      },
      {
        spotId: 3,
        userId: 3,
        review: "Great location and wonderfully styled kitchen. Would use again.",
        stars: 5
      },
      {
        spotId: 4,
        userId: 4,
        review: "Modern kitchen and is spacious enough for a family. Not a fan of the colors.",
        stars: 4
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options);

    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options);

    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options);

    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'firstaatester'] }
    }, {});
  }
};
