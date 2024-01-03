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

// router.get('/:spotId', async(req, res) => {
//   const spotId = req.params.spotId;
//   const spot = await Spot.findByPk(spotId, {
//     attributes: [
//       'id',
//       'ownerId',
//       'address',
//       'city',
//       'state',
//       'country',
//       'lat',
//       'lng',
//       'name',
//       'description',
//       'price',
//       'createdAt',
//       'updatedAt',
//     ],
//     include: [
//       {
//         model: SpotImage,
//         attributes: ['id', 'url', 'preview']
//       },
//       {
//         model: User,
//         as: 'Owner',
//         attributes: ['id', 'firstName', 'lastName'],
//       },
//     ]
//   });

//   if (!spot) {
//     return res.status(404).json({ message: "Spot couldn't be found" });
//   }

//   const avgRating = await Review.findOne({
//     attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
//     where: {
//       spotId: spot.id,
//     },
//   });

//   const previewImage = await SpotImage.findOne({
//     attributes: ['url'],
//     where: {
//       spotId: spot.id,
//     },
//   });

//   const spotDetails = {
//     id: spot.id,
//     ownerId: spot.ownerId,
//     address: spot.address,
//     city: spot.city,
//     state: spot.state,
//     country: spot.country,
//     lat: spot.lat,
//     lng: spot.lng,
//     name: spot.name,
//     description: spot.description,
//     price: spot.price,
//     createdAt: spot.createdAt,
//     updatedAt: spot.updatedAt,
//     avgRating: avgRating ? avgRating.get('avgRating') : null,
//     previewImage: previewImage ? previewImage.url : null,
//   };

//   res.status(200).json(spotDetails);
  // const spotRes = await Promise.all(
  //   spots.map(async (spot) => {
  //     const avgRatingArray = await Review.findAll({
  //       attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
  //       where: {
  //         spotId: spot.id,
  //       },
  //     });

  //     const previewImage = await SpotImage.findOne({
  //       attributes: ['url'],
  //       where: {
  //         spotId: spot.id,
  //       },
  //     });

  //     let avgRating = null;
  //     if (avgRatingArray[0]) {
  //     avgRating = avgRatingArray[0].get('avgRating');
  //     };


  //     return {
  //       ...spot.toJSON(),
  //       avgRating,
  //       previewImage: previewImage ? previewImage.url : null,
  //     };
  //   })
  // );

  // res.status(200).json( spots );
// });

router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  // Retrieve spot details including associations and aggregate data
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
      // {
      //   model: User, as: 'Owner',
      //   attributes: ['id', 'firstName', 'lastName'],
      // },
    ],
  });

  // Handle case when the spot with the provided id does not exist
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

  // Extract and format relevant data
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

  // Send the response
  res.status(200).json(spotDetails);
});

module.exports = router;
