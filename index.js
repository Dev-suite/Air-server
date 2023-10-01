require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan());

app.use("/user", require("./src/user/user.route"));
app.use("/admin", require("./src/admin/admin_route"));
app.use("/subscribe", require("./src/subscribers/subscribers_routes"));
app.use("/community", require("./src/community/communityRoutes"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.AIR_HOME_HOTEL_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((_) => {
    console.log("Connected to DataBase");
    app.listen(PORT, () => console.log("listening on port:" + PORT));
  });
