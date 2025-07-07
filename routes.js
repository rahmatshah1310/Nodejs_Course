const fs=require("fs")
const requestHandler=(req,res)=>{
    const url=req.url;
    const method = req.method;
    if (url === "/") {
        res.write("<html>");
        res.write("<head><title>Hello This is Message</title></head>")
        res.write("<body><form method='POST' action='/message'><input type='text' name='message'/><button type='sumbit'>submit</button></form></body>")
        res.write("</html>")
        return res.end()
    }
    if (url === "/message" && method === "POST") {
        const body = []
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        })
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString()
            const message = parseBody.split("=")[0];
            fs.writeFileSync("message.txt", message, (error) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            });

        })

    }
    res.setHeader("Content-Type", "text/html")
    res.write("<html>");
    res.write("<head><title>Hello This is Title</title></head>")
    res.write("<body><h1>Hello This is Body</h1></body>")
    res.write("</html>")
    res.end()
 }

//  module.exports=requestHandler;

//  module.exports={
//     handler:requestHandler,
//     someText:"Some Hard coed text"
//  };

// module.exports.handler=requestHandler,
// module.exports.someText="Some Hard coded text"

exports.handler=requestHandler,
exports.someText="Some Hard coded text"