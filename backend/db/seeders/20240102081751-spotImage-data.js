'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

options.tableName = 'SpotImages'

/** @type {import('sequelize-cli').Migration} */

const spotImages = [
  {
    spotId: 1,
    url: 'sampleUrl1',
    preview: true,
  },
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImages, {validate: true});
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['sampleUrl1'] }
    });
  }
};
