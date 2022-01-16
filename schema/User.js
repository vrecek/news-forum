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
   },

   messages: {
      type: [{
         from: String,
         title: String,
         dateTime: {
            type: Date,
            default: Date.now
         },
         viewed:  {
            type: Boolean,
            default: false
         },
         text: String
      }],
      
      default: []
   }
})

module.exports = mongoose.model("User", User)