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

exports.listReservations = async (req, res, next) => {
  try {
    const { id } = req.user;
    // 1.Count Campings
    // 2.Count Nights
    // 3.Totals

    const campings = await prisma.landmark.count({
      where: {
        profileId: id,
      },
    });

    const totals = await prisma.booking.aggregate({
      where: {
        profileId: id,
      },
      _sum: {
        totalNights: true,
        total: true,
      },
    });

    console.log(totals);
    res.json({
      campings: campings,
      nights: totals._sum.totalNights,
      totals: totals._sum.total,
    });
  } catch (error) {
    next(error);
  }
};
