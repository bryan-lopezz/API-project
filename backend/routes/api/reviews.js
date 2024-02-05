const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const validateReview = [
  check('review').notEmpty().withMessage('Review text is required'),
  check('stars').isInt({min: 1, max: 5}).withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

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
    stars: parseInt(review.stars),
    createdAt: review.createdAt.toJSON().split('T').join(' at ').split('Z').join('').slice(0,19),
    updatedAt: review.updatedAt.toJSON().split('T').join(' at ').split('Z').join('').slice(0,19),
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
      lat: parseFloat(review.Spot.lat),
      lng: parseFloat(review.Spot.lng),
      name: review.Spot.name,
      price: parseFloat(review.Spot.price),
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

  if(!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    });
  };

  if (review.userId !== userId) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  const allReviewImages = await ReviewImage.findAll({
    where: {
      reviewId: reviewId
    },
  });

  if(allReviewImages.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached"
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

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  let { review, stars } = req.body;
  const userId = req.user.id;
  const reviewId = req.params.reviewId;

  let currentReview = await Review.findByPk(reviewId);

  if (!currentReview) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (currentReview.userId !== userId) {
    res.status(403);
    return res.json({
      message: "Forbidden"
    });
  };

  currentReview.set({
    userId,
    spotId: currentReview.spotId,
    review,
    stars,
  });

  await currentReview.save();

  const formattedReviewResponse = {
    ...currentReview.toJSON(),
    createdAt: currentReview.createdAt.toJSON().split('T').join(' at ').split('Z').join('').slice(0,19),
    updatedAt: currentReview.updatedAt.toJSON().split('T').join(' at ').split('Z').join('').slice(0,19),
  }

  res.status(200).json(formattedReviewResponse);
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  const review = await Review.findOne({
    where: {
      id: reviewId,
    },
  });

  if(review && (review.userId !== userId)) {
    return res.status(403).json({
      message: "Forbidden"
    });
  };

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  await review.destroy();

  res.status(200).json({ message: 'Successfully deleted' });
})

module.exports = router;
