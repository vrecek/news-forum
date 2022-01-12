const mongoose = require('mongoose')

const User = mongoose.Schema({
   username: {
      type: String,
      required: true
   },

   mail: {
      type: String,
      required: true
   },

   hash: {
      type: String,
      required: true
   },

   salt: {
      type: String,
      required: true
   },

   createDate: {
      type: Date,
      default: Date.now
   }
})

module.exports = mongoose.model("user", User)