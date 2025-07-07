const path=require('path')
const http = require("http");
const bodyParser=require('body-parser')

const express=require("express")
const adminRoutes=require("./routes/admin")
const userRoutes=require("./routes/shop")
const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes)
app.use(userRoutes)

app.use((req,res,next)=>{
   res.status(404).sendFile(path.join(__dirname,'views','page-notfound.html'))
})


const server = http.createServer(app)
server.listen(3000)