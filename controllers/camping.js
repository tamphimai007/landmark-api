const prisma = require("../config/prisma");

exports.listCamping = async (req, res, next) => {
  try {
    // code body
    const { id } = req.params;
    // console.log(id);
    const campings = await prisma.landmark.findMany({
      include: {
        favorites: {
          where: { profileId: id },
          select: { id: true },
        },
      },
    });

    // console.log(campings);
    // full
    // const campingWithLike = campings.map((item)=>{
    //   return {
    //     ...item,
    //     isFavorite: item.favorites.length > 0
    //   }
    // })
    // shor hand
    const campingWithLike = campings.map((item) => ({
      ...item,
      isFavorite: item.favorites.length > 0,
    }));
    // console.log(campingWithLike)
    res.json({ result: campingWithLike });
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
    console.log(error);
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

// Favorites
exports.actionFavorite = async (req, res, next) => {
  try {
    // code body
    const { campingId, isFavorite } = req.body;
    const { id } = req.user;

    // Add or Remove
    let result;
    if (isFavorite) {
      result = await prisma.favorite.deleteMany({
        where: {
          profileId: id,
          landmarkId: campingId,
        },
      });
    } else {
      result = await prisma.favorite.create({
        data: {
          landmarkId: campingId,
          profileId: id,
        },
      });
    }

    res.json({
      message: isFavorite ? "Remove Favorite" : "Add Favorite",
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.listFavorites = async (req, res, next) => {
  try {
    // code body
    const { id } = req.user;
    const favorites = await prisma.favorite.findMany({
      where: { profileId: id },
      include: { landmark: true },
    });

    const favoriteWithLike = favorites.map((item) => {
      return {
        ...item,
        landmark: {
          ...item.landmark,
          isFavorite: true,
        },
      };
    });

    // console.log(favoriteWithLike);

    res.json({ message: "success", result: favoriteWithLike });
  } catch (error) {
    next(error);
  }
};

exports.filterCamping = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    // console.log(category, search);

    const filter = [];
    if (category) {
      filter.push({ category: category });
    }
    if (search) {
      filter.push({ title: { contains: search } });
    }

    // OR:[
    //   {key:value},
    //   {key:value}
    // ]
    const result = await prisma.landmark.findMany({
      where: {
        OR: filter,
      },
      include: {
        favorites: {
          select: {
            id: true,
          },
        },
      },
    });

    const campingWithLike = result.map((item) => ({
      ...item,
      isFavorite: item.favorites.length > 0,
    }));

    // console.log(campingWithLike);

    res.json({ result: campingWithLike });
  } catch (error) {
    next(error);
  }
};
