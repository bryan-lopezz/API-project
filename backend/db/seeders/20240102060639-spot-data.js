'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};
/** @type {import('sequelize-cli').Migration} */
options.tableName = 'Spots';

const spots = [
  {
    ownerId: 1,
    address: "234 Viper Street",
    city: "Phoenix",
    state: "Arizona",
    country: "United States of Valor",
    lat: 33.4483771,
    lng: -112.0740373,
    name: "Spike Haven Academy",
    description: "Training ground for tactical agents",
    price: 150,
  },
  {
    ownerId: 2,
    address: "567 Jett Lane",
    city: "Windwalker",
    state: "Texas",
    country: "United States of Valor",
    lat: 29.4241219,
    lng: -98.4936282,
    name: "BladeMaster Institute",
    description: "Precision and agility in every move",
    price: 110,
  },
  {
    ownerId: 3,
    address: "890 Brimstone Boulevard",
    city: "Valkyrie",
    state: "California",
    country: "United States of Valor",
    lat: 34.052235,
    lng: -118.243683,
    name: "Phoenix Rising Academy",
    description: "Igniting the flames of victory",
    price: 135,
  },
  {
    ownerId: 4,
    address: "121 Sage Street",
    city: "Sentinel City",
    state: "Colorado",
    country: "United States of Valor",
    lat: 39.7392358,
    lng: -104.990251,
    name: "Tactical Intel Hub",
    description: "Mastering the art of strategic defense",
    price: 120,
  },
  {
    ownerId: 5,
    address: "789 Duelist Drive",
    city: "Radiant Heights",
    state: "Florida",
    country: "United States of Valor",
    lat: 27.9944024,
    lng: -81.760254,
    name: "Radiant Academy",
    description: "Elevating agents to Radiant status",
    price: 160,
  }

];

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate(spots, { validate: true });
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["234 Viper Street", "567 Jett Lane", "890 Brimstone Boulevard", "121 Sage Street", "789 Duelist Drive"] }
    })
  }
};
