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
  origin: process.env.FRONTEND
}));

app.use(express.static("public"))


const { MongoDBDAO } = require("./DAO/dao")
const { User } = require('./DAO/DataClasses/User');
let mongodbdao = new MongoDBDAO();


app.listen(process.env.PORT || 3000, ()=>{
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})

app.post("/signup", (req, res)=>{
  let dob = new Date(`${req.body.birthYear}-${req.body.birthMonth}-${req.body.birthDay}`);

  if (dob > Date().setFullYear(Date().getFullYear - 12) ) {
  //  422: Unproccessible Content Cause of age
    res.send("Unproceccible: This user is too young").statusCode("422")
  }else if( req.firstName <=3 ){
    res.send("Unproceccible: This user is too young").statusCode("422")
  }else if( req.laststName <=3 ){
    res.send("Unproceccible: This user is too young").statusCode("422")
  }

  let user = new User(req.body.firstName, req.body.lastName, dob, req.body.phone, req.body.password, req.body.email);
  mongodbdao.createNewUser(user).then(
    res.send("SignUp Completed").statusCode(200)
  ).catch(
    res.send("SignUp Failed").statusCode(500)
  );
})

app.get("/test", function(req, res){
  res.send("Test Done server working").statusCode("200")
})