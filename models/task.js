'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User, { foreignKey: 'userID', as: 'user' });
      Task.hasMany(models.Task, { foreignKey: 'parentTaskID', as: 'subtasks' });
      Task.belongsTo(models.Task, { foreignKey: 'id', as: 'parentTask' });
    }
  }
  Task.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    parentTaskID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tasks',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    title: DataTypes.STRING,
    status: DataTypes.STRING,
    orderIndex: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
