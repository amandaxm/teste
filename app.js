require('dotenv').config();
const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');
const caronaRoute = require('./routes/caronas-route');
const userRoute = require('./routes/usuario-route');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

app.use(cors());
app.set(cors(), '*');

app.use(bodyParser.json());
app.use('/carona', caronaRoute);
app.use('/usuario', userRoute);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    // `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tjoqq.mongodb.net/?retryWrites=true&w=majority`
    // 'mongodb://127.0.0.1:27017'
    `mongodb+srv://root:root@cluster0.tjoqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Conectou ao banco!');
    app.listen(3000);
  })
  .catch((err) => console.log(err));
