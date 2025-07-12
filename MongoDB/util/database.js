const mongodb=require('mongodb')

const MongoClient=mongodb.MongoClient
let _db;
const mongoConnect=(callback)=>{
  MongoClient.connect('mongodb+srv://rahmatshah1310:srGL5c0YC1bfQ0NR@cluster0.usljxbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(
  client=>{
    console.log("Connected!");
    _db = client.db("test")
    console.log(_db)
  }
).catch(
  err=>{
    console.log(err)
  }
)
}

const getdb=()=>{
  if(_db){
  return _db;
}else{
  throw "No database found"
}
}
module.exports={
  mongoConnect,
  getdb
};