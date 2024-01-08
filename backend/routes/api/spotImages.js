const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const userId = req.user.id;

  const spotImage = await SpotImage.findOne({
    where: {
      id: imageId,
    },
    include: [
      {
        model: Spot,
        where: {
          ownerId: userId,
        },
      },
    ],
  });

  if (!spotImage) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  };

  await spotImage.destroy();

  return res.json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
