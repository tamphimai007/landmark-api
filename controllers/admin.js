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
        landmark: {
          profileId: id,
        },
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

exports.listAllReservations = async (req, res, next) => {
  try {
    // Code body
    const { id } = req.user;
    const reservations = await prisma.booking.findMany({
      where: {
        paymentStatus: true,
        landmark: {
          profileId: id,
        },
      },
      include: {
        landmark: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(reservations);

    res.json({ result: reservations });
  } catch (error) {
    next(error);
  }
};
