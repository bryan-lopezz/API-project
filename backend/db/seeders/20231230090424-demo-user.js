'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'demo1',
        lastName: 'demo1',
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'demo2',
        lastName: 'demo2',
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'demo3',
        lastName: 'demo3',
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'demo4',
        lastName: 'demo4',
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'demo5',
        lastName: 'demo5',
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4'] }
    }, {});
  }
};
