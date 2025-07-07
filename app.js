const http = require("http");
const routes=require("./routes")
const fs = require("fs");
console.log(routes.someText)
const server = http.createServer(routes.handler)
server.listen(3000)