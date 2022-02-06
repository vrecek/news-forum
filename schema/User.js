const mongoose = require('mongoose')

const User = mongoose.Schema({
   role: {
      type: String,
      default: 'normal'
   },

   username: {
      type: String,
      required: true
   },
   canChangeName: {
      lastChanged: { type: Number, default: Date.now() },
      timeLeft: { type: Number, default: 1 }
   },


   mail: {
      type: String,
      required: true
   },
   canChangeMail: {
      lastChanged: { type: Number, default: Date.now() },
      timeLeft: { type: Number, default: 1 }
   },


   firstname: {
      type: String,
      default: 'Not set'
   },
   lastname: {
      type: String,
      default: 'Not set'
   },
   birthday: {
      type: String,
      default: 'Not set'
   },
   gender: {
      type: String,
      default: 'Not set'
   },
   avatar: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: null }
   },
   nationality: {
      type: String,
      default: 'Not set'
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
      
      default: [{
         from: 'Ipsum Blog',
         title: 'Thanks for registering',
         text: 'Hello! Thanks for registering in our service. We hope you find this interesting. This is a sample message sent automatically after registering. Regards'
      }]
   },


   aboutMe: {
      type: String,
      default: ' '
   }
})

module.exports = mongoose.model("User", User)