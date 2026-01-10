const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MongoDBDAO } = require("./DAO/dao")
const { User } = require('./DAO/DataClasses/User');
let mongodbdao = new MongoDBDAO();

app.use(function(req,res,next){
  console.log(`A request ${req.method} from ${req.url} at ${Date().toLocaleString()} from ${req.ip}`)
  next()
})



app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, birthDay, birthMonth, birthYear } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !birthDay || !birthMonth || !birthYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await mongodbdao.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Date from parts
    const dob = new Date(`${birthYear}-${birthMonth}-${birthDay}`);

    const newUser = new User(firstName, lastName, dob, phone, hashedPassword, email);
    await mongodbdao.createNewUser(newUser);

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
})