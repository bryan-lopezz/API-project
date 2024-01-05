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

router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;
  const reviewId = req.params.reviewId;

  const review = await Review.findByPk(reviewId);
  const allReviewImages = await ReviewImage.findAll({
    where: {
      reviewId: reviewId
    },
  });
  // res.json(allReviewImages);
  if(allReviewImages.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached"
    });
  };

  if(!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  };

  if (review.userId !== userId) {
    return res.status(403).json({
      message: "Unauthorized. You don't have permission to add an image to this spot."
    });
  };

  const createReviewImage = await ReviewImage.create({
    reviewId,
    url
  });

  const newReviewImageResponse = {
    id: createReviewImage.id,
    url: createReviewImage.url
  };

  res.status(200).json(newReviewImageResponse);
})


module.exports = router;
