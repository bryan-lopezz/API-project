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
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg',
    preview: true,
  },
  {
    spotId: 3,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg',
    preview: true,
  },
  {
    spotId: 4,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg',
    preview: true,
  },
  {
    spotId: 5,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg',
    preview: true,
  },
  {
    spotId: 6,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/v1708474380/stnsomcuuy3msytvwzyi.jpg',
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
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    });
  }
};
