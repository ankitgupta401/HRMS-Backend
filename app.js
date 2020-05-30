const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require('./routes/routes');
const path = require('path');
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ankit:mostwanted4321@cluster0-dnqdb.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true , useCreateIndex: true , useUnifiedTopology: true })
.then(() => {
console.log('Connected to Database');
})
.catch(() => {
  console.log('Connection Failed');
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
  app.use(express.static(path.join(__dirname, 'build')));
  app.use("/" , routes);
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.listen(9000);


  module.exports = app;