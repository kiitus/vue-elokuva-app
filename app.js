const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
app.use(express.static('public'))
app.get("/",(req,res)=>
{
    res.redirect("/main.html")
})
app.listen(port);