const express = require('express')
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use((req,res,next)=>{
  console.log(`A ${req.method} from ${req.url} with IP ${req.ip}`);
  next()
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}));

app.use(express.static("public"))


const { MongoDBDAO } = require("./DAO/dao")
const { User } = require('./DAO/DataClasses/User');
let mongodbdao = new MongoDBDAO();


app.listen(process.env.PORT || 3000, ()=>{
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})

app.post("/signup", (req, res)=>{

  console.log(req.body);

  let dob = new Date(`${req.body.birthYear}-${req.body.birthMonth}-${req.body.birthDay}`);

  // Age check: user must be at least 18 years old
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

  if (dob > minAgeDate) {
    // 422: Unprocessable Content — user is too young
    return res.status(422).json({ message: "You must be at least 18 years old to sign up." });
  }

  if (!req.body.firstName || req.body.firstName.length <= 3) {
    return res.status(422).json({ message: "First name must be more than 3 characters." });
  }

  if (!req.body.lastName || req.body.lastName.length <= 3) {
    return res.status(422).json({ message: "Last name must be more than 3 characters." });
  }

  let user = new User(req.body.firstName, req.body.lastName, dob, req.body.phone, req.body.password, req.body.email);
  mongodbdao.createNewUser(user)
    .then(() => {
      res.status(200).json({ message: "SignUp Completed" });
    })
    .catch((err) => {
      console.error("DB error:", err);
      res.status(500).json({ message: "SignUp Failed" });
    });
})

app.get("/test", function(req, res){
  res.send("Test Done server working").statusCode("200")
})