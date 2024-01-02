'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

options.tableName = 'ReviewImages'

/** @type {import('sequelize-cli').Migration} */

const reviewImages = [
  {
    reviewId: 1,
    url: 'reviewImageUrl1'
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImages, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['reviewImageUrl1'] }
    });
  }
};
