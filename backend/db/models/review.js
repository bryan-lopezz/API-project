'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });

      Review.belongsTo(models.User, {
        foreignKey: 'userId',
      });

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Review.init({
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      },
    },
    stars: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          args: true,
          msg: "Stars must be an integer from 1 to 5"
        },
        min: 1,
        max: 5
      },
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
