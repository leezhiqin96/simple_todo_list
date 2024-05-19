'use strict';
const { Model } = require('sequelize');
const crypto = require('crypto');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Task, { foreignKey: "id", as: "tasks" });
    }

    static hashPassword(password) {
      console.log("hashing password");
      let passBuffer = [];
      let buffer = new Buffer.alloc(password.length * 2, password, "utf16le");
      for (let i = 0; i < buffer.length; i++) {
        passBuffer.push(buffer[i]);
      }

      let hash = crypto.createHash("sha256").update(buffer).digest("base64");
      return hash;
    }

    static verifyPassword(plaintext, password) {
      const hashPw = this.hashPassword(plaintext);
      return hashPw === password;
    }

    static async login(credentials, password) {
      const user = await this.findOne({
        where: { [Op.or]: [{ userName: credentials }, { email: credentials }] },
      });

      if (user) {
        const correctPassword = this.verifyPassword(password, user.dataValues.password)
        return correctPassword ? user : null
      }
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    hooks: {
      // Before creating a user, hash the password
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await User.hashPassword(user.password);
        }
      },
      // Before updating a user, hash the new password if changed
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await User.hashPassword(user.password);
        }
      }
    }
  });
  return User;
};
