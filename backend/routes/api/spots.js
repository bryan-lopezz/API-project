const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');
const Sequelize = require('sequelize');


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
      attributes: [
        'id',
        'ownerId',
        'address',
        'city',
        'state',
        'country',
        'lat',
        'lng',
        'name',
        'description',
        'price',
        'createdAt',
        'updatedAt',
      ],
    });

    const spotRes = await Promise.all(
      spots.map(async (spot) => {
        const avgRatingArray = await Review.findAll({
          attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
          where: {
            spotId: spot.id,
          },
        });

        const previewImage = await SpotImage.findOne({
          attributes: ['url'],
          where: {
            spotId: spot.id,
          },
        });

        let avgRating = null;
        if (avgRatingArray[0]) {
        avgRating = avgRatingArray[0].get('avgRating');
        }

        // const avgRating = avgRatingArray.length > 0 ? avgRatingArray[0].get('avgRating') : null;


        return {
          ...spot.toJSON(),
          avgRating,
          previewImage: previewImage ? previewImage.url : null,
        };
      })
    );
    console.log(spotRes)

    res.status(200).json({ Spots: spotRes });
});

module.exports = router;
