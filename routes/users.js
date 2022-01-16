const express = require('express')
const router = express.Router()
const Database = require('../Database')
const User = require('../schema/User')
const passport = require('passport')


// user register
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


// user login
router.post('/login', passport.authenticate('local', { failureRedirect: '/api/users/failed' }), (req, res) => {
   if(req.body.remember){
      const onemonth = 1000 * 60 * 60 * 24 * 30
      req.session.cookie.maxAge = onemonth
   }

   res.json({ success: true })
})


// return true,user or false
router.get('/is-authed', async (req, res) => {
   const db = new Database('', { User: User })
   const authResult = await db.isAuthed(req, 'User')

   res.json(authResult)
})


// logout
router.get('/logout', (req, res) => {
   if(req.isAuthenticated()){
      req.logout()
      res.redirect('http://localhost:3000')
   }else{
      res.redirect('http://localhost:3000/error')
   }
})


// send message
router.put('/send-message', async (req,res) => {
   if(!req.isAuthenticated()) res.redirect('http://localhost:3000/error')

   const { to, title, text } = req.body

   if(!text || !to || !title) return res.json({ success: false, msg: 'All fields are required' })

   const db = new Database('', { User: User })
   const currentUser = await db.isAuthed(req, 'User')

   if(currentUser.user.username === to){ 
      return res.json({ success: false, msg: `You cant send message to yourself!` })  
   }
   
   const msgBody = {
      from: currentUser.user.username,
      title: title,
      text: text
   }

   const succeed = await db.updateOne('User', { username: to }, 'messages', msgBody, true)

   if(succeed) return res.json({ success: true, msg: 'Message successfully sent' })
   return res.json({ success: false, msg: `User -${to}- don't exist` })  
})


// view one user message
router.get('/get-message/:id', async (req, res) => {
   const db = new Database('', { User: User })
   const currUser = await db.isAuthed(req, 'User')

   if(!currUser.result) res.json({ success: false, msg: 'You are not authorized to be here' })

   const msgs = await db.viewArray('User', currUser.user._id, 'messages', req.params.id)

   if(msgs.length === 0){ 
      res.statusMessage = 'Message ID not found. Looks like you messed with URL'
      return res.status(404).end()
   }

   if(!msgs[0].viewed){
      await db.updateArray('User', currUser.user._id, 'messages', req.params.id, 'viewed', true)
   }

   res.json(msgs)
})


// login failed helper
router.get('/failed', (req, res) => {
   res.json({ msg:'Incorrect username or password', success: false })
})

module.exports = router