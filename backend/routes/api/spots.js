const express = require('express')
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const validateSpot = [
  check('address').notEmpty().withMessage('Street address is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('state').notEmpty().withMessage('State is required'),
  check('country').notEmpty().withMessage('Country is required'),
  check('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be within -90 and 90'),
  check('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be within -180 and 180'),
  check('name').isLength({ min: 1, max: 50 }).withMessage('Name must be less than 50 characters'),
  check('name').notEmpty().withMessage('Name is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('price').isInt({min: 0}).withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

const validateReview = [
  check('review').notEmpty().withMessage('Review text is required'),
  check('stars').isNumeric({min: 1, max: 5}).withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

router.get('/', async (req, res) => {
  let { size, page } = req.query;

  if (parseInt(size) < 1 && parseInt(page) < 1) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        page: "Page must be greater than or equal to 1",
        size: "Size must be greater than or equal to 1"
      }
    });
  };

  if (parseInt(page) < 1) {
    return res.status(400).json({
      message: "Bad Request",
      error: {
        page: "Page must be greater than or equal to 1"
      }
    });
  };

  if (parseInt(size) < 1) {
    return res.status(400).json({
      message: "Bad Request",
      error: {
        size: "Size must be greater than or equal to 1"
      }
    });
  };

  page = Math.min(10, parseInt(page)) || 1;
  size = Math.min(20, parseInt(size)) || 20;

  const pagination = {
    limit: size,
    offset: size * (page - 1)
  };


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
    ...pagination
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
      avgRating = parseInt(avgRating).toFixed(1);
      };


      return {
        ...spot.toJSON(),
        avgRating,
        previewImage: previewImage ? previewImage.url : null,
      };
    })
  );

  res.status(200).json({ Spots: spotRes, page, size });
});

router.get('/current', requireAuth, async(req, res) => {
  const userId = req.user.id;
  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
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

router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spotId = req.params.spotId;
  const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({
        message: "Forbidden"
      });
    };

    const createSpotImage = await SpotImage.create({
      spotId: spotId,
      url: url,
      preview: preview
    });

    const newImageResponse = {
      id: createSpotImage.id,
      url: createSpotImage.url,
      preview: createSpotImage.preview
    };

    res.status(200).json(newImageResponse);

})

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  let { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;
  const spotId = req.params.spotId;

  let currentSpot = await Spot.findByPk(spotId);

  if (!currentSpot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };

  if (currentSpot.ownerId !== userId) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  // const spot = await Spot.findOne({
  //   where: {
  //     id: spotId,
  //     ownerId: userId,
  //   },
  // });


  currentSpot.set({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  await currentSpot.save();

  // const editedSpot = await currentSpot.findByPk(spotId);

  res.status(200).json(currentSpot);

});

router.delete('/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const currentSpot = await Spot.findByPk(spotId);

  if (currentSpot.ownerId !== userId) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  const spot = await Spot.findOne({
    where: {
      id: spotId,
      ownerId: userId,
    },
  });


  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };

  await spot.destroy();

  res.status(200).json({ message: 'Successfully deleted' });

})

router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId);

  if(!spot) {
    return res.status(404).json({message: "Spot couldn't be found"})
  };

  const reviews = await Review.findAll({
    where: {
      spotId: spotId
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });


  const reviewsList = reviews.map(review => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName
    },
    ReviewImages: review.ReviewImages.map(image => ({
      id: image.id,
      url: image.url
    }))
  }));

  res.status(200).json({Reviews: reviewsList});
});

router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  };

  const existingReview = await Review.findOne({
    where: {
      spotId: spotId,
      userId: userId
    }
  });

  if (existingReview) {
    return res.status(500).json({
      message: 'User already has a review for this spot',
    });
  }

  const createSpotReview = await Review.create({
    spotId,
    userId,
    review,
    stars
  });

  res.status(201).json(createSpotReview);
});

router.get('/:spotId/bookings', requireAuth, async(req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  };

  const bookings = await Booking.findAll({
    where: {
      spotId,
    },
    attributes: ['spotId', 'startDate', 'endDate']
  });

  const userBookings = await Booking.findAll({
    where: {
      spotId,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
    ]
  })

  userId == spot.ownerId ? res.json({Bookings: userBookings}) : res.json({Bookings: bookings});

});

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  let { startDate, endDate } = req.body;
  const spotId = parseInt(req.params.spotId);
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  };

  if(spot.ownerId == userId) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  const currentDate = new Date();
  const startDateCheck = new Date(startDate);
  const endDateCheck = new Date(endDate);

  if (startDateCheck < currentDate && endDateCheck <= startDateCheck) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
        endDate: "endDate cannot be on or before startDate"
      }
    });
  };

  if (startDateCheck < currentDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past"
      }
    });
  };

  if (endDateCheck <= startDateCheck) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot be on or before startDate"
      }
    });
  };

  const booking = await Booking.findOne({
    where: {
      spotId,
      [Op.and]: [
        {
          startDate: {
            [Op.lte]: endDateCheck
          }
        },
        {
          endDate: {
            [Op.gte]: startDateCheck
          }
        }
      ]
    }
  });

  if(booking) {
    const bookingStart = new Date(booking.startDate).getTime();
    const bookingEnd = new Date(booking.endDate).getTime();

    if(endDateCheck.getTime() == bookingStart) {
      return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            error: {
              endDate: "End date conflicts with an existing booking"
            }
          });
    };

    if (startDateCheck >= bookingStart && endDateCheck <= bookingEnd) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
              }
            });
      };

    if (startDateCheck >= bookingStart) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            error: {
                startDate: "Start date conflicts with an existing booking"
              }
            });
      };

    if (endDateCheck <= bookingEnd) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            error: {
                endDate: "End date conflicts with an existing booking"
              }
            });
      };

    if (startDateCheck < bookingStart && endDateCheck > bookingEnd) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
          }
        });
    };
  };

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate
  });

  return res.json(newBooking);
});


module.exports = router;
