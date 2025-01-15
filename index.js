const express = require("express");
const app = express();

const port = 9000;

app.get("/", (req, res)=> {
    res.json({message: "hello, This server is running with the help of DOCKER"});
});

app.listen(port, ()=> console.log(`server running at port ${port}`));