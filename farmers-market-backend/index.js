const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
require('dotenv').config();

app.use(cors({ origin: '*' })); // Allow all origins for debugging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`)
  next()
})

app.get("/", (req, res) => {
  res.status(200).send("Server is running correctly.");
});

const { MongoDBDAO } = require("./DAO/dao")
const { User } = require('./DAO/DataClasses/User');
let mongodbdao = new MongoDBDAO();



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

    res.status(201).json({ result: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
})