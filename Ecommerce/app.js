const express = require('express');
const path = require('path');
require("dotenv").config();
const cors=require("cors");
const { mongooseConnection } = require('./config/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const loggerMiddleware=require('./middlewares/logger.mw')
const responseMiddleware=require('./middlewares/response.mw')
const session=require('express-session')


app.use(
  session({
    secret:"secret2025",
    resave:false,
    saveUninitialized:false
  })
)

//handle ejs file in the view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(loggerMiddleware)
//handle all middleware related to response like fail success
app.use(responseMiddleware)
app.use(express.static("public"));

app.use(cors());
app.use(
  cors({
    origin:["http://localhost:3000", "http://68.183.112.7", "http://localhost:5173/"],
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials:true,
  })
)

//handle all routes in the authroutes
const authRoutes = require('./routes/auth.routes');
app.use('/api/v1', authRoutes); 

//using it for public images or styling
app.get('/', (req, res) => {
  res.render('index', { title: "Instagram" });
});

app.use('/api/v1',require('./routes/index'))

mongooseConnection();


//handle page not found
app.use(function(err,req,res,next){
  console.log("Page Not Found")
  res.fail("Page Not Found")
})

module.exports = app;