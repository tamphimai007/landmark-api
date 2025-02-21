const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const { readdirSync } = require("fs");
const handleError = require("./middlewares/error");
require("dotenv/config");
const { clerkMiddleware } = require("@clerk/express");

// middleware
app.use(cors()); // ติดไว้ก่อน
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(clerkMiddleware());
// Method GET,POST, PUT,PATCH, DELETE

readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.use(handleError);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
