'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

options.tableName = 'Bookings'

/** @type {import('sequelize-cli').Migration} */

const bookings = [
  {
    spotId: 1,
    userId: 2,
    startDate: '2024-02-03',
    endDate: '2024-02-18'
  },
  {
    spotId: 1,
    userId: 2,
    startDate: '2024-03-15',
    endDate: '2024-03-18'
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '2024-03-22',
    endDate: '2024-03-25'
  },
  {
    spotId: 3,
    userId: 4,
    startDate: '2024-03-10',
    endDate: '2024-03-12'
  },
  {
    spotId: 4,
    userId: 1,
    startDate: '2024-04-05',
    endDate: '2024-04-20'
  },
  {
    spotId: 5,
    userId: 2,
    startDate: '2024-05-05',
    endDate: '2024-05-07'
  },

];

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(bookings, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    });
  }
};
