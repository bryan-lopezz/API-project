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
    url: "https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi",
    preview: true,
  },
  {
    spotId: 2,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 3,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 4,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 5,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 6,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 7,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 8,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 9,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 10,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 11,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 12,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 13,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 14,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 15,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
    preview: true,
  },
  {
    spotId: 16,
    url: 'https://res.cloudinary.com/lopez-projects/image/upload/f_auto,q_auto/stnsomcuuy3msytvwzyi',
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
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8 ,9, 10,
        11, 12, 13, 14, 15, 16
      ] }
    });
  }
};
