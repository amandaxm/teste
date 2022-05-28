require("dotenv").config();
const cors = require('cors');

const express = require("express");
const mongoose = require("mongoose");
const caronaRoute = require('./routes/caronas-route');
const userRoute = require('./routes/usuario-route');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
app.use('/carona', caronaRoute);
app.use('/usuario', userRoute);
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Header',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).send({});
  }
  app.use(cors());
  next();
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tjoqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));