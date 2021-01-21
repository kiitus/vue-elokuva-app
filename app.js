const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.static('public'))


const mongoose = require('mongoose')


const reviewsRouter = require('./controllers/review')

require('dotenv').config()

const mongoUrl = process.env.MONGO

mongoose.connect(mongoUrl, {
    useCreateIndex: true,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
    })

app.use(express.json())



app.use('/api/reviews',reviewsRouter)




app.get("/",(req,res)=>
{
    res.redirect("/main.html")
})
app.listen(port,()=>
{
    console.log(`Server running at port ${port}`)
});