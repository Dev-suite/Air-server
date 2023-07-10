require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();



app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.json({ limit: '10kb' }))
app.use(morgan());


app.use("/user", require("./src/user/user.route"));


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.AIR_HOME_HOTEL_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((_) => {
    console.log("Connected to DataBase");
    app.listen(PORT, () => console.log('listening on port:' + PORT));
})
