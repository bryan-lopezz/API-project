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
    userId: 1,
    startDate: '2021-11-19',
    endDate: '2021-11-20'
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(bookings, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1] }
    });
  }
};
