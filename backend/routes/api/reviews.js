const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: {
      userId: userId
    },
    include: [
      {
        model: Spot,
        // as: 'Spot',
        include: [
          {
            model: SpotImage,
            as: 'SpotImages',
            attributes: ['url']
          }
        ]
      },
      {
        model: User,
        // as: 'User',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  // Modify the structure of the reviews before sending the response
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
    Spot: {
      id: review.Spot.id,
      ownerId: review.Spot.ownerId,
      address: review.Spot.address,
      city: review.Spot.city,
      state: review.Spot.state,
      country: review.Spot.country,
      lat: review.Spot.lat,
      lng: review.Spot.lng,
      name: review.Spot.name,
      price: review.Spot.price,
      previewImage: review.Spot.SpotImages.length > 0 ? review.Spot.SpotImages[0].url : null
    },
    ReviewImages: review.ReviewImages.map(image => ({
      id: image.id,
      url: image.url
    }))
  }));

  res.status(200).json({ Reviews: reviewsList });
});


module.exports = router;
