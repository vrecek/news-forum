const mongoose = require('mongoose')

const News = mongoose.Schema({
   title: {
      type: String,
      required: true
   },

   shortTitle: {
      type: String,
      required: true
   },

   image: {
      type: String,
      default: 'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
   },

   tags: [String],
   
   data: {
      type: Date,
      default: Date.now
   }
})

module.exports = mongoose.model("news", News)