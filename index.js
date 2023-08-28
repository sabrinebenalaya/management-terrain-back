const express = require("express");
const cors = require('cors')
const dotenv = require('dotenv');
const partnerRoute = require('./Routes/PartnerRoute')
const reservationRoute = require('./Routes/ReservationRoute')
const terrainRoute = require('./Routes/TerrainRoute')
const authRoute = require('./Routes/AuthRoute')
const userRoute = require('./Routes/UserRoute')
const connect = require("./ConnectDB/connectDB");

const app = express();
dotenv.config();
const port = process.env.PORT;

app.listen(port, (e) => {
  if (e) {
    console.log("server is failed ⚠️");
  } else {
    console.log(`server is connected on port ${port} ✅`);
  }
});


connect();

app.use(cors({
  origin: '*'
})); 

app.use(express.json());
app.use('/partners', partnerRoute);
app.use('/terrains', terrainRoute);
app.use('/reservations', reservationRoute);
app.use('/auth', authRoute);
app.use('/users', userRoute);

