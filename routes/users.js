const express = require('express')
const router = express.Router()
const Database = require('../Database')
const User = require('../schema/User')

router.post('/register', async (req,res) => {
   const [nick, mail, pass, passconf, check, captcha] = req.body
   const db = new Database(process.env.DB, { User: User })
   const errorArray = []

   db.validateNick_AlphaNumeric(nick, 3, 20, errorArray)
   db.validateEmail(mail, errorArray)
   db.validatePassword(pass, 4, 30, errorArray)
   db.validatePassword(pass, 4, 30, errorArray, passconf)
   db.validateCheck(check, 'Please accept our regulamin', errorArray)
   await db.verifyCaptcha(captcha, process.env.CAPTCHA_SECRET, req.socket.remoteAddress, errorArray)
   
   if(errorArray.length !== 0){
      return res.json({ success: false, errors: errorArray })
   }

   const doesMailExist = await db.doesExists('User', 'mail', mail)
   const doesUserExist = await db.doesExists('User', 'username', nick)

   if(doesMailExist) errorArray.push('Mail address is already in use')
   if(doesUserExist) errorArray.push('Username is already taken')

   if(errorArray.length !== 0){
      return res.json({ success: false, errors: errorArray })
   }

   // NOW EVERYTHING IS ALRIGHT
   const {salt, hash} = db.generateHash(pass)
   await db.createOne('User', false, {
      username: nick,
      mail,
      hash,
      salt
   })

   res.json({ success: true, successMessage: ['Successfully registered! You can login now'] })
})

router.post('/login', (req, res) => {
   res.send('dx')
})

module.exports = router