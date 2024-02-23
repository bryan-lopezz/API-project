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
    url: "https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg",
    preview: true,
  },
  {
    spotId: 2,
    url: 'sampleUrl2',
    preview: true,
  },
  {
    spotId: 3,
    url: 'sampleUrl3',
    preview: true,
  },
  {
    spotId: 4,
    url: 'sampleUrl4',
    preview: true,
  },
  {
    spotId: 5,
    url: 'sampleUrl5',
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
      url: { [Op.in]: ['sampleUrl1', 'sampleUrl2', 'sampleUrl3', 'sampleUrl4', 'sampleUrl5'] }
    });
  }
};
