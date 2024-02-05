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

const validateSpotQueryParams = [
  check('page').isInt({ min: 1 }).optional().withMessage('Page must be greater than or equal to 1'),
  check('size').isFloat({ min: 1 }).optional().withMessage('Size must be greater than or equal to 1'),
  check('minLat').isFloat({ min: -90 }).optional().withMessage('Minimum latitude is invalid'),
  check('maxLat').isFloat({ max: 90 }).optional().withMessage('Maximum latitude is invalid'),
  check('minLng').isFloat({ min: -180 }).optional().withMessage('Minimum longitude is invalid'),
  check('maxLng').isFloat({ max: 180 }).optional().withMessage('Maximum longitude is invalid'),
  check('minPrice').isInt({ min: 0 }).optional().withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice').isInt({ min: 0 }).optional().withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

const validateReview = [
  check('review').notEmpty().withMessage('Review text is required'),
  check('stars').isInt({min: 1, max: 5}).withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

router.get('/', validateSpotQueryParams, async (req, res) => {
  let { size, page, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = Math.min(10, parseInt(page)) || 1;
  size = Math.min(20, parseInt(size)) || 20;

  const where = {};

  if (minLat && maxLat) {
    minLat = parseFloat(minLat)
    maxLat = parseFloat(maxLat)

    where.lat = {
      [Op.and]: [
        { [Op.gte]: minLat },
        { [Op.lte]: maxLat }
      ]
     };
  }
  if (minLng && maxLng) {
    minLng = parseFloat(minLng)
    maxLng = parseFloat(maxLng)

    where.lng = {
      [Op.and]: [
        { [Op.gte]: minLng },
        { [Op.lte]: maxLng }
      ]
     };
  }
  if (minPrice && maxPrice) {
    minPrice = parseFloat(minPrice)
    maxPrice = parseFloat(maxPrice)

    where.price = {
      [Op.and]: [
        { [Op.gte]: minPrice },
        { [Op.lte]: maxPrice }
      ]
     };
  }

  if (minLat) {
    minLat = parseFloat(minLat)
    where.lat = { [Op.gte]: minLat };
  };

  if (maxLat) {
    maxLat = parseFloat(maxLat)
    where.lat = { [Op.lte]: maxLat };
  };

  if (minLng) {
    minLng = parseFloat(minLng)
    where.lng = { [Op.gte]: minLng };
  };

  if (maxLng) {
    maxLng = parseFloat(maxLng)
    where.lng = { [Op.lte]: maxLng };
  };

  if (minPrice) {
    minPrice = parseInt(minPrice)
    where.price = { [Op.gte]: minPrice };
  };

  if (maxPrice) {
    maxPrice = parseInt(maxPrice)
    where.price = { [Op.lte]: maxPrice };
  };

  const pagination = {
    limit: size,
    offset: size * (page - 1)
  };


  const spots = await Spot.findAll({
    where,
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

      const formattedCreatedAt = spot.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);
      const formattedUpdatedAt = spot.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);

      if (avgRatingArray[0]) {
        avgRating = avgRatingArray[0].get('avgRating');
        avgRating = parseFloat(avgRating);
      };

      return {
        ...spot.toJSON(),
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        price: parseFloat(spot.price),
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        avgRating: avgRating || "No reviews",
        previewImage: previewImage ? previewImage.url : "No preview",
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

      if (avgRatingArray[0]) {
      avgRating = avgRatingArray[0].get('avgRating');
      avgRating = parseFloat(avgRating);
      };

      const formattedCreatedAt = spot.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);
      const formattedUpdatedAt = spot.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);

      return {
        ...spot.toJSON(),
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        price: parseFloat(spot.price),
        avgRating: avgRating || "No reviews",
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

  const formattedCreatedAt = spot.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);
  const formattedUpdatedAt = spot.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);

  const spotDetails = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    name: spot.name,
    description: spot.description,
    price: parseFloat(spot.price),
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt,
    numReviews: reviewsData.get('numReviews') ? parseFloat(reviewsData.get('numReviews')) : 0,
    avgStarRating: reviewsData.get('avgStarRating') ? parseFloat(reviewsData.get('avgStarRating')) : "No reviews",
    SpotImages: spot.SpotImages,
    Owner: owner ? owner.toJSON() : null,
  };

  res.status(200).json(spotDetails);
});

router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;

  const newSpot = await Spot.create({
    ownerId: userId,
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

  const newSpotResponse = {
    ...newSpot.toJSON(),
    lat: parseFloat(newSpot.lat),
    lng: parseFloat(newSpot.lng),
    price: parseFloat(newSpot.price),
    createdAt: newSpot.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
    updatedAt: newSpot.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19)
  };

  res.status(201).json(newSpotResponse);
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
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const userId = req.user.id;
  const spotId = req.params.spotId;

  const currentSpot = await Spot.findByPk(spotId);

  if (!currentSpot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };

  if (currentSpot.ownerId !== userId) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };


  currentSpot.set({
    address,
    city,
    state,
    country,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    name,
    description,
    price: parseFloat(price),
  });

  await currentSpot.save();

  const formattedCreatedAt = currentSpot.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);
  const formattedUpdatedAt = currentSpot.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19);

  const currentSpotResponse = {
    ...currentSpot.toJSON(),
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt
  };

  res.status(200).json(currentSpotResponse);

});

router.delete('/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const currentSpot = await Spot.findByPk(spotId);

  if (currentSpot && (currentSpot.ownerId !== userId)) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  if (!currentSpot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  };

  await currentSpot.destroy();

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
    userId: parseInt(review.userId),
    spotId: parseInt(review.spotId),
    review: review.review,
    stars: parseInt(review.stars),
    createdAt: review.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
    updatedAt: review.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
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
  let { review, stars } = req.body;
  const spotId = parseInt(req.params.spotId);
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
    userId,
    spotId,
    review,
    stars
  });

  const createSpotReviewResponse = {
    ...createSpotReview.toJSON(),
    userId: parseInt(userId),
    stars: parseInt(stars),
    createdAt: createSpotReview.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
    updatedAt: createSpotReview.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
  };

  res.status(201).json(createSpotReviewResponse);
});

router.get('/:spotId/bookings', requireAuth, async(req, res) => {
  const spotId = parseInt(req.params.spotId);
  const userId = parseInt(req.user.id);

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

  const bookingsList = bookings.map(booking => {
    booking = booking.toJSON();
    return {
      spotId,
      startDate: booking.startDate.toJSON().slice(0,10),
      endDate: booking.endDate.toJSON().slice(0,10)
    }
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
  });

  const userBookingsList = userBookings.map(userBooking => ({
      User: userBooking.User,
      id: userBooking.id,
      spotId,
      userId,
      startDate: userBooking.startDate.toJSON().slice(0,10),
      endDate: userBooking.endDate.toJSON().slice(0,10),
      createdAt: userBooking.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
      updatedAt: userBooking.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19)
  }));

  if (userId !== spot.ownerId) {
    res.json({Bookings: bookingsList})
  };

  res.json({Bookings: userBookingsList});


});

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  let { startDate, endDate } = req.body;
  const spotId = parseInt(req.params.spotId);
  const userId = parseInt(req.user.id);

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

  console.log(typeof startDate)

  const newBooking = await Booking.create({
    spotId,
    userId,
    startDate,
    endDate
  });

  const newBookingFormatted = {
    ...newBooking.toJSON(),
    startDate: newBooking.startDate.toJSON().slice(0,10),
    endDate: newBooking.endDate.toJSON().slice(0,10),
    createdAt: newBooking.createdAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
    updatedAt: newBooking.updatedAt.toJSON().split('T').join(' ').split('Z').join('').slice(0,19),
  }

  return res.json(newBookingFormatted);
});


module.exports = router;
