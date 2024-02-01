const express = require('express')
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Booking } = require('../../db/models');
const { Op } = require('sequelize');

router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const bookings = await Booking.findAll({
    where: { userId },
    include: [
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {
            model: SpotImage,
            attributes: ['url'],
            where: { preview: true },
            required: false
          },
        ],
      },
    ],
  });

  const responseBookings = bookings.map((booking) => ({
    id: booking.id,
    spotId: booking.spotId,
    Spot: {
      id: booking.Spot.id,
      ownerId: booking.Spot.ownerId,
      address: booking.Spot.address,
      city: booking.Spot.city,
      state: booking.Spot.state,
      country: booking.Spot.country,
      lat: booking.Spot.lat,
      lng: booking.Spot.lng,
      name: booking.Spot.name,
      price: booking.Spot.price,
      previewImage: booking.Spot.SpotImages.length > 0 ? booking.Spot.SpotImages[0].url : 'no image available'
    },
    userId: booking.userId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }));

  res.status(200).json({ Bookings: responseBookings });
});

router.put('/:bookingId', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  const booking = await Booking.findOne({
    where: {
      id: bookingId,
      userId,
    }
  });

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    });
  };

  if(booking.userId !== userId) {
    return res.status(403).json({
      message: "You are not authorized to make this request"
    });
  };

  const currentDate = new Date();
  const startDateCheck = new Date(startDate);
  const endDateCheck = new Date(endDate);

  if(endDateCheck < currentDate) {
    return res.status(403).json({
      message: "Past bookings can't be modified"
    });
  };

  if (startDateCheck < currentDate && endDateCheck <= startDateCheck) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
        endDate: "endDate cannot be on or before startDate"
      }
    });
  }

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

  const existingBooking = await Booking.findOne({
    where: {
      id: { [Op.ne]: bookingId },
      spotId: booking.spotId,
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

  if (existingBooking) {
    const bookingStart = new Date(existingBooking.startDate).getTime();
    const bookingEnd = new Date(existingBooking.endDate).getTime();

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

  booking.set({
    spotId: booking.spotId,
    userId,
    startDate,
    endDate
  });

  await booking.save();

  const editedBooking = await Booking.findByPk(bookingId);

  res.json(editedBooking);

});

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  const booking = await Booking.findOne({
    where: {
      id: bookingId,
      userId,
    }
  });

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    });
  };

  const spot = await Spot.findByPk(booking.spotId);

  const currentTime = new Date();
  const bookingStart = new Date(booking.startDate);
  const bookingEnd = new Date(booking.endDate)

  if (currentTime >= bookingStart && currentTime <= bookingEnd) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted"
    });
  };

  if (booking || spot) {
    await booking.destroy()

    return res.json({
      message: "Successfully deleted"
    });
  };
});

module.exports = router;
