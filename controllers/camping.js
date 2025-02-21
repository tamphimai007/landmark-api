const prisma = require("../config/prisma");

exports.listCamping = async (req, res, next) => {
  try {
    // code body
    const campings = await prisma.landmark.findMany();
    res.json({ result: campings });
  } catch (error) {
    next(error);
  }
};

exports.readCamping = async (req, res, next) => {
  try {
    // code body
    const { id } = req.params;
    const camping = await prisma.landmark.findFirst({
      where: {
        id: Number(id),
      },
    });

    res.json({ result: camping });
  } catch (error) {
    next(error);
  }
};

exports.createCamping = async (req, res, next) => {
  try {
    // code body
    const { title, description, price, category, lat, lng, image } = req.body;
    const { id } = req.user;

    const camping = await prisma.landmark.create({
      data: {
        title: title,
        description: description,
        price: price,
        category: category,
        lat: lat,
        lng: lng,
        public_id: image.public_id,
        secure_url: image.secure_url,
        profileId: id,
      },
    });
    res.json({
      message: "Create Camping Successfully!!!",
      result: camping,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCamping = (req, res, next) => {
  try {
    res.send("Hello Update ");
  } catch (error) {
    next(error);
  }
};

exports.deleteCamping = (req, res, next) => {
  try {
    res.send("Hello Delete");
  } catch (error) {
    next(error);
  }
};
