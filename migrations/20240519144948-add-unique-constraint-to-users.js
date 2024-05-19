'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Users', {
      fields: ['userName'],
      type: 'unique',
      name: 'unique_userName_constraint'
    });

    await queryInterface.addConstraint('Users', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_email_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Users', 'unique_userName_constraint');
    await queryInterface.removeConstraint('Users', 'unique_email_constraint');
  }
};
