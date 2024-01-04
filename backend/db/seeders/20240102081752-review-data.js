'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

options.tableName = 'Reviews'

const reviews = [
  {
    spotId: 1,
    userId: 1,
    review: 'something good',
    stars: 4,
  },
  {
    spotId: 1,
    userId: 2,
    review: 'something good',
    stars: 2,
  },
  {
    spotId: 2,
    userId: 1,
    review: 'something good',
    stars: 2,
  },
  {
    spotId: 3,
    userId: 3,
    review: 'something good',
    stars: 2,
  },
  {
    spotId: 4,
    userId: 4,
    review: 'something good',
    stars: 4,
  },
  {
    spotId: 5,
    userId: 5,
    review: 'something good',
    stars: 4,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate(reviews, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5] }
    });
  }
};
