const prisma = require("../config/prisma");
const { calTotal } = require("../utils/booking");
const renderError = require("../utils/renderError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.listBookings = async (req, res, next) => {
  try {
    const { id } = req.user;

    const bookings = await prisma.booking.findMany({
      where: {
        profileId: id,
        paymentStatus: true,
      },
      include: {
        landmark: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        checkIn: "asc",
      },
    });
    // console.log(bookings);

    res.json({ result: bookings, message: "สู้ๆ นะ" });
  } catch (error) {
    next(error);
  }
};

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

exports.checkout = async (req, res, next) => {
  try {
    const { id } = req.body;
    // Step 1 find booking
    const booking = await prisma.booking.findFirst({
      where: { id: Number(id) },
      include: {
        landmark: {
          select: {
            id: true,
            secure_url: true,
            title: true,
          },
        },
      },
    });
    if (!booking) {
      return renderError(404, "Not found camping jukkru!!!");
    }
    const { total, totalNights, checkIn, checkOut, landmark } = booking;
    const { title, secure_url } = landmark;

    // Step 2 Stripe
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { bookingId: booking.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "thb",
            product_data: {
              name: title,
              images: [secure_url],
              description: "ขอบใจหลายๆ จ้า ที่จองที่พักของเรา",
            },
            unit_amount: total * 100,
          },
        },
      ],
      mode: "payment",
      return_url: `http://localhost:5173/user/complete/{CHECKOUT_SESSION_ID}`,
    });

    // console.log(total, totalNights, checkIn, checkOut, title, secure_url);
    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    next(error);
  }
};

exports.checkOutStatus = async (req, res, next) => {
  try {
    // code
    const { session_id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const bookingId = session.metadata?.bookingId;

    // Check
    if (session.status !== "complete" || !bookingId) {
      return renderError(400, "Something Wrong!!!!");
    }

    // Update DB paymentStatus => true

    const result = await prisma.booking.update({
      where: {
        id: Number(bookingId),
      },
      data: {
        paymentStatus: true,
      },
    });

    res.json({ message: "Payment Complete", status: session.status });
  } catch (error) {
    next(error);
  }
};
