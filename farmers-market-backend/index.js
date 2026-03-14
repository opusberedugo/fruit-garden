const express = require('express')
const cors = require("cors")

const { TextCypher } = require("./Encoder/TextCypher");
let textCypher = new TextCypher('aes-256-cbc', 32, 16);

const { Mailer } = require("./Mailer/Mailer");
let mailer = new Mailer();

const app = express()
require("dotenv").config()

app.use((req, res, next) => {
  console.log(`A ${req.method} from ${req.url} with IP ${req.ip}`);
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}));

app.use(express.static("public"))

const { MongoDBDAO } = require("./DAO/dao")
const { User } = require('./DAO/DataClasses/User');
let mongodbdao = new MongoDBDAO();


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})

app.post("/signup", async (req, res) => {

  console.log(req.body);

  let dob = new Date(`${req.body.birthYear}-${req.body.birthMonth}-${req.body.birthDay}`);

  // Age check: user must be at least 18 years old
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

  if (req.body.firstName.trim().length < 3 || req.body.lastName.trim().length < 3) {
    return res.status(422).json({ message: "First name / Last name must not be less than 3 characters." });
  }

  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)) {
    return res.status(422).json({ message: "Invalid email address." });
  }

  if (dob > minAgeDate) {
    // 422: Unprocessable Content — user is too young
    return res.status(422).json({ message: "You must be at least 18 years old to sign up." });
  }

  if (!/^(\+?230[\s-]?)?[2456789]\d{3}[\s-]?\d{4}$/.test(req.body.phone.trim())) {
    return res.status(422).json({ message: "Invalid phone number. Valid phone number format" });
  }

  if (req.body.password.length < 6) {
    return res.status(422).json({ message: "Password must be at least 6 characters." });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(422).json({ message: "Passwords do not match." });
  }

  try {
    let user = new User(req.body.firstName, req.body.lastName, dob, req.body.phone, textCypher.encrypt(req.body.password), req.body.email);
    let result = await mongodbdao.createNewUser(user)
    console.error("New Creation Result",result)

    if(result){
      res.status(200).json({ id: textCypher.encrypt(result.insertedId.toString()) });
    }
  
  } catch (error) {
    if(error.code === 11000)
      return res.status(409).json({ message: "Email already exists." });
  }

  if (result) {
    res.status(200).json({ message: "SignUp Completed" });
  }
  else {
    res.status(500).json({ message: "SignUp Failed" });
  }
})

app.get("/send-verification-email/:id", async function (req, res) {
  let code = textCypher.generateRandomEmailCode();
  await mongodbdao.dumpEmailCode(code, textCypher.decrypt(req.params.id));
  let userEmail = await mongodbdao.getEmailfromID(textCypher.decrypt(req.params.id));
  mailer.sendVerficationEmail(code, userEmail);
  res.send("Verification Email Sent").statusCode("200")
})

app.post("/verify-email/:id", async function (req, res) {
  let code = req.body.code;
  let id = textCypher.decrypt(req.params.id);
  let result = await mongodbdao.getEmailCode(id);
  if(result){
    if(result.code === code){
      await mongodbdao.deleteEmailCode(id);
      res.send("Email Verified").statusCode("200")
    }
    else{
      res.send("Invalid Code").statusCode("401")
    }
  }
  else{
    res.send("Email Not Found").statusCode("404")
  }
})

app.get("/test", function (req, res) {
  res.send("Test Done server working").statusCode("200")
})