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
      data: { type: Buffer, default: null },
      contentType: { type: String, default: null }
   },

   tags: [String],
   
   data: {
      type: Date,
      default: Date.now
   },

   views: {
      type: Number,
      default: 0
   },

   category: {
      type: String,
      default: 'All'
   },

   text: {
      type: String,
      default: 'Default text'
   },

   author: {
      type: {
         firstname: { type: String },
         lastname: { type: String },
         nickname: { type: String },
         avatar: {
            source: { type: String },
            contentType: { type: String }
         }
      }
   },

   comments: {
      type: [{
         author: {
            name: { type: String },
            avatar: { type: String }
         },
         text: String,
         dateTime: { type: Date, default: Date.now() },
         likes: { type: Number, default: 0 },
         dislikes: { type: Number, default: 0 }
      }],
      default: []
   }
})

module.exports = mongoose.model("news", News)