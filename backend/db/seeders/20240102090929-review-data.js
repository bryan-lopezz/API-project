'use strict';

const { Review } = require('../models');
const review = require('../models/review');

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
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate(reviews, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1] }
    });
  }
};
