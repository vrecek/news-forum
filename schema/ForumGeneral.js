const mongoose = require('mongoose')
const Database = require('../Database')

const ForumGeneral = mongoose.Schema({
   title: String,
   text: String,

   postData: {
      type: String,
      default: Database.convertDefaultDate({}, new Date(Date.now())).data
   },

   uploadedImages: {
      type: [{
         data: Buffer,
         contentType: String
      }],
      default: []
   },

   postAuthor: {
      type: {
         name: { type: String },
         avatar: {
            mime: { type: String },
            convertedSrc: { type: String }
         }
      }
   },

   favourites: {
      type: Number,
      default: 0
   },
   whosFav: {
      type: [String],
      default: []
   },

   likes: {
      type: Number,
      default: 0
   },
   whoLiked: {
      type: [String],
      default: []
   },

   dislikes: {
      type: Number,
      default: 0
   },
   whoDisliked: {
      type: [String],
      default: []
   },

   comments: {
      type: [{
         author: {
            name: String,
            avatar: {
               mime: String,
               convertedSrc: String 
            }
         },

         likes: {
            type: Number,
            default: 0
         },
         whoLiked: {
            type: [String],
            default: []
         },

         text: String,

         convertedDateTime: String
      }],
      default: []
   }
})

module.exports = mongoose.model('ForumGeneral', ForumGeneral)