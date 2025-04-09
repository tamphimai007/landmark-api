const prisma = require("../config/prisma");

exports.listStats = async (req, res, next) => {
  try {
    const usersCount = await prisma.profile.count();
    const campingsCount = await prisma.landmark.count();
    const bookingsCount = await prisma.booking.count({
      where: {
        paymentStatus: true,
      },
    });

    res.json({
      usersCount: usersCount,
      campingsCount: campingsCount,
      bookingsCount: bookingsCount,
    });
  } catch (error) {
    next(error);
  }
};
