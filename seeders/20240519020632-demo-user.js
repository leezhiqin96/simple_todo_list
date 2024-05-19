'use strict';
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await User.create({
      userName: 'johndoe',
      email: 'john@gmail.com',
      password: 'password',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
