const prisma = require("../config/prisma");
const { calTotal } = require("../utils/booking");
const renderError = require("../utils/renderError");

exports.createBooking = async (req, res, next) => {
  try {
    // Overview
    // Step 1 Destrutoring req.body
    // Step 2 Delete Booking
    // Step 3 Find Camping
    // Step 4 Calculate Total
    // Step 5 Insert to db
    // Step 6 Send id booking to react

    // Step 1 Destrutoring req.body
    const { campingId, checkIn, checkOut } = req.body;
    const { id } = req.user;
    // Step 2 Delete Booking
    await prisma.booking.deleteMany({
      where: {
        profileId: id,
        paymentStatus: false,
      },
    });
    // Step 3 Find Camping
    const camping = await prisma.landmark.findFirst({
      where: {
        id: campingId,
      },
      select: {
        price: true,
      },
    });
    if (!camping) {
      return renderError(400, "Camping Not found");
    }

    // Step 4 Calculate Total
    const { total, totalNights } = calTotal(checkIn, checkOut, camping.price);
    // console.log(total, totalNights);
    // Step 5 Insert to db
    const booking = await prisma.booking.create({
      data: {
        profileId: id,
        landmarkId: campingId,
        checkIn: checkIn,
        checkOut: checkOut,
        total: total,
        totalNights: totalNights,
      },
    });
    // console.log(booking);
    const bookingId = booking.id;
    // Step 6 Send id booking to react

    res.json({ message: "Booking Success!!", result: bookingId });
  } catch (error) {
    next(error);
  }
};
