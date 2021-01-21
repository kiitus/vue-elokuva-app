const mongoose = require('mongoose')


const reviewSchema = mongoose.Schema({
    title: String, 
    year: String,
    poster:String,
    imdb: String,
    rating:String,
    review:String,
    day:String
})

    reviewSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Review', reviewSchema)