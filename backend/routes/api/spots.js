const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');
const Sequelize = require('sequelize');

const validateSpot = [
  check('address').notEmpty().withMessage('Street address is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('state').notEmpty().withMessage('State is required'),
  check('country').notEmpty().withMessage('Country is required'),
  check('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be within -90 and 90'),
  check('lng').isFloat().withMessage('Longitude must be within -180 and 180'),
  check('name').isLength().withMessage('Name must be less than 50 characters'),
  check('description').notEmpty().withMessage('Description is required'),
  check('price').isNumeric().withMessage('Price per day must be a positive number'),
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
        };


        return {
          ...spot.toJSON(),
          avgRating,
          previewImage: previewImage ? previewImage.url : null,
        };
      })
    );

    res.status(200).json({ Spots: spotRes });
});

router.get('/current', requireAuth, async(req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
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
      };


      return {
        ...spot.toJSON(),
        avgRating,
        previewImage: previewImage ? previewImage.url : null,
      };
    })
  );

  res.status(200).json({ Spots: spotRes });
});

router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId, {
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
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview'],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  const owner = await spot.getOwner({
    attributes: ['id', 'firstName', 'lastName']
  });

  const reviewsData = await Review.findOne({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'numReviews'],
      [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating'],
    ],
    where: {
      spotId: spot.id,
    },
  });

  const spotDetails = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    numReviews: reviewsData ? reviewsData.get('numReviews') : 0,
    avgStarRating: reviewsData ? reviewsData.get('avgStarRating') : null,
    SpotImages: spot.SpotImages,
    Owner: owner ? owner.toJSON() : null,
  };
  console.log('spotDetails:', spotDetails);

  res.status(200).json(spotDetails);
});

router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;

  const newSpot = await Spot.create({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    ownerId: userId,
  });

  res.status(201).json(newSpot);
});

module.exports = router;
