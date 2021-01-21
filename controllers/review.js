const reviewsRouter = require('express').Router()
const review = require("../models/review")


reviewsRouter.get("/",(req,res)=>
{

    review.find({}).then((founded)=>
    {
        console.log(founded)
        res.send(founded)
    })
})
reviewsRouter.post("/",(req,res)=>
{
    sended = req.body
    const data = new review(
    {
        title: sended.title, 
        year: sended.year,
        poster:sended.poster,
        imdb: sended.imdbRating,
        rating:sended.yourRating,
        review:sended.review,
        day:sended.watchDay
    })

    data.save().then((database)=>
    {
        res.send(database)
    }).catch((error)=>
    {
        console.log(`error: ${error}`)
    })


    
})


reviewsRouter.patch("/:id",(req,res)=>
{

    let sended = req.body
    let id = req.params.id

    const data =
    {
        title: sended.title, 
        year: sended.year,
        poster:sended.poster,
        imdb: sended.imdbRating,
        rating:sended.yourRating,
        review:sended.review,
        day:sended.watchDay
    }


    review.findByIdAndUpdate(id, data, { new: true }).then((modified) =>
    {
        res.send(modified)
    }).catch((error)=>
    {
        console.log(`error: ${error}`)
    })


    
})


reviewsRouter.delete("/:id",(req,res)=>
{
    const id = req.params.id

  review.findByIdAndDelete(id).then(()=>
  {
     res.sendStatus(200)
  })
})
module.exports = reviewsRouter;
