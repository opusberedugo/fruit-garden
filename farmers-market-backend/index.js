const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
const { MongoDBDAO } = require("./DAO/dao")
const { User } = require('./DAO/DataClasses/User');
let mongodbdao = new MongoDBDAO();



app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});

app.post("/signup", (req, res) => {
  console.log(req.body);

  mongodbdao.createNewUser(new User(req.body.firstName, req.body.lastName, new Date(`${req.body.birthYear}-${req.body.birthMonth}-${req.body.birthDay}`), req.body.phoneNumber, req.body.password, req.body.email));
  console.log(req.body);
  res.send("User created");
})