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
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });

      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE'
      });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
