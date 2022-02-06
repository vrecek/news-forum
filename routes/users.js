const express = require('express')
const router = express.Router()
const Database = require('../Database')
const User = require('../schema/User')
const passport = require('passport')

const path = require('path')
const fs = require('fs')
const multer = require('multer')



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


const assignAvatar = async us => {
   const avatar = Database.bufferToImg(us[0]?.avatar)
   Object.assign(avatar, us[0]._doc)
   const date = Database.convertDefaultDate(avatar, avatar.createDate)

   return new Promise((resolve, reject) => resolve(date))
}
// get user by name (user profile)
router.get('/by-name/:name', async (req,res) => {
   try{
      const db = new Database('', { User: User })
      
      const user = await db.viewOne('User', req.params.name, 'username') 
      const convertedUser = await assignAvatar(user)

      res.json(convertedUser)
   }catch(err){
      res.statusMessage = err.message
      res.status(err.code).end()
   }
})


// get user avatar
router.get('/get-avatar', async (req, res) => {
   const db = new Database('', { User: User })
   const user = await db.isAuthed(req, 'User')

   const src = Database.bufferToImg(user.user?.avatar)

   res.json(src)
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


// update nickname
router.put('/change-nickname', async (req,res) => {
   try{
      const { newName, confName } = req.body 
      if(!newName || !confName) return res.status(202).json({msg: 'All fields are required', success: false})
   
      const db = new Database('', { User: User })

      const { success, errMsg } = db.validateNick_AlphaNumeric(newName, 3, 15)

      if(!success) return res.status(202).json({msg: errMsg, success: false})
      if(newName !== confName) return res.status(202).json({msg: 'Names are not the same', success: false})

      const does_exist = await db.doesExists('User', 'username', newName)
      if(does_exist) return res.status(202).json({msg: 'This name was already taken', success: false})

      await db.updateOne('User', { _id: req.session.passport.user }, 'username', newName)
      await db.updateObject('User', req.session.passport.user, 'canChangeName', 'timeLeft', 172800000)
      await db.updateObject('User', req.session.passport.user, 'canChangeName', 'lastChanged', Date.now())
   
      return res.status(200).json({msg: 'Successfully changed', success: true})
   }catch(err){
      res.status(500).json({msg:err.message, success:false})
   }
})


// can change nickname
router.get('/can-nickname', async (req,res) => {
   const db = new Database('', { User: User })
   
   const auth = await db.isAuthed(req, 'User')
   
   if(!auth.result) res.status(401).json({ msg: 'You are not authorized', success: false })
   const can = Database.hasTimePassed(auth.user.canChangeName.timeLeft, auth.user.canChangeName.lastChanged, true, true)

   res.json(can)
}) 

// can change mail
router.get('/can-mail', async (req,res) => {
   const db = new Database('', { User: User })
   
   const auth = await db.isAuthed(req, 'User')
   
   if(!auth.result) res.status(401).json({ msg: 'You are not authorized', success: false })
   const can = Database.hasTimePassed(auth.user.canChangeMail.timeLeft, auth.user.canChangeMail.lastChanged, true, true)

   res.json(can)
}) 


// update mail address
router.put('/change-mail', async (req,res) => {
   try{
      const { mail, mailconf } = req.body
      if(!mail || !mailconf) return res.status(202).json({msg: 'All fields are required', success: false})

      const db = new Database('', { User: User })
      const { success, errMsg } = db.validateEmail(mail)
      
      if(!success) return res.status(202).json({msg: errMsg, success: false})
      if(mail !== mailconf) return res.status(202).json({msg: 'Addresses are not the same', success: false})

      const does_exist = await db.doesExists('User', 'mail', mail)
      if(does_exist) return res.status(202).json({msg: 'This address was already taken', success: false})

      await db.updateOne('User', { _id: req.session.passport.user }, 'mail', mail)
      await db.updateObject('User', req.session.passport.user, 'canChangeMail', 'timeLeft', 172800000)
      await db.updateObject('User', req.session.passport.user, 'canChangeMail', 'lastChanged', Date.now())
      
      return res.status(200).json({msg: 'Successfully changed', success: true})
   }catch(err){
      res.status(500).json({msg:err.message, success:false})
   }
})


// update password
router.put('/change-password', async (req,res) => {
   const { oldpass, newpass, confnewpass } = req.body
   
   if(!oldpass || !newpass || !confnewpass) return res.status(202).json({msg: 'All fields are required', success: false})
   if(newpass !== confnewpass) return res.status(202).json({msg: 'New passwords are different', success: false})

   const db = new Database('', { User: User })
   const { success, errMsg } = db.validatePassword(newpass, 3, 25)

   if(!success) return res.status(202).json({msg: errMsg, success: false})

   const userf = await db.isAuthed(req, 'User')
   const isValid = db.verifyHash(oldpass, userf.user.hash, userf.user.salt)
   
   if(!isValid) return res.status(202).json({msg: 'You have passed wrong password', success: false})

   // update pass
   const { salt, hash } = db.generateHash(newpass)
   await db.updateOne('User', { _id: userf.user._id }, 'salt', salt)
   await db.updateOne('User', { _id: userf.user._id }, 'hash', hash)

   req.logout()

   return res.status(200).json({msg: 'Successfully changed', success: true})
})


// change user avatar
const upload = multer({ dest: 'uploads/user-avatar' })
router.post('/change-avatar', upload.single('img'), async (req,res) => {
   if(req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg'){
      return res.status(405).json({ success: false, msg: 'Unacceptable format. Allowed formats: JPG/JPEG, PNG' })
   }

   const db = new Database('', { User: User })
   
   try{
      await db.updateObject('User', req.session.passport.user, 'avatar', 'data', fs.readFileSync(path.join(__dirname, '..', 'uploads', 'user-avatar', req.file.filename)))
      await db.updateObject('User', req.session.passport.user, 'avatar', 'contentType', req.file.mimetype)
   }catch(err){
      res.status(500).json({ success: false, msg: err.message })
   }

   res.json({ success: true, msg: 'Successfully changed avatar' })
})


// change prof description
router.post('/change-desc', async (req, res) => {
   const [text] = req.body
   const db = new Database('', { User: User })
   try{
      const escaped = Database.escapeCharacters(text)

      await db.updateOne('User', { _id: req.session.passport.user }, 'aboutMe', escaped)
      return res.json(true)
   }catch(err){
      res.statusMessage = err.message
      return res.status(500).json(false)
   }
})


// UPDATE PERSONAL INFO
router.put('/change-personal', async (req,res) => {
   const [firstname, surname, day, month, year, nationality, m, f, o] = [...req.body]
   let changed = false

   const db = new Database('', { User: User })

   try{
      if(firstname || surname){
         if(firstname && surname){
            changed = true
            const sanf = db.validateNick_AlphaNumeric(firstname, 1, 40, false)
            const sans = db.validateNick_AlphaNumeric(firstname, 1, 40, false)

            if(!sanf.success || !sans.success){
               return res.status(400).json({ success: false, msg: 'Name must be alpha numeric' })
            }

            await db.updateOne('User', { _id: req.session.passport.user }, 'firstname', firstname)
            await db.updateOne('User', { _id: req.session.passport.user }, 'lastname', surname)
         }else{
            return res.status(400).json({ success: false, msg: 'Both firstname and surname fields are required' })
         }   
      }
   
      if(day !== 'None' || month !== 'None' || year !== 'None'){
         if(day !== 'None' && month !== 'None' && year !== 'None'){
            changed = true
            let monthnr = null

            switch(month){
               case 'February': monthnr = '02'
                  break;
               case 'March': monthnr = '03'
                  break;
               case 'April': monthnr = '04'
                  break;
               case 'May': monthnr = '05'
                  break;
               case 'June': monthnr = '06'
                  break;
               case 'July': monthnr = '07'
                  break;
               case 'August': monthnr = '08'
                  break;
               case 'September': monthnr = '09'
                  break;
               case 'October': monthnr = '10'
                  break;
               case 'November': monthnr = '12'
                  break;
               case 'December': monthnr = '12'
                  break;
               default: monthnr = '01'
            }
            
            const fulldate = `${day}-${monthnr}-${year}`
            await db.updateOne('User', { _id: req.session.passport.user }, 'birthday', fulldate)
         }else{
            return res.status(400).json({ success: false, msg: 'Enter all date fields' })
         }     
      }
   
      if(m || f || o){
         changed = true
   
         const gen = m || f || o
         await db.updateOne('User', { _id: req.session.passport.user }, 'gender', gen)
      }

      if(nationality){
         changed = true
         const sann = db.validateNick_AlphaNumeric(nationality, 1, 40, false)
         if(!sann.success){
            return res.status(400).json({ success: false, msg: 'Nationality must be alpha numeric' })
         }
         await db.updateOne('User', { _id: req.session.passport.user }, 'nationality', nationality)
      }
   }catch(err){
      return res.status(500).json({ success: false, msg: 'Internal server error' })
   }
   
   if(!changed){
      return res.status(400).json({ success: false, msg: 'Every field is empty' })
   }

   return res.status(200).json({ success: true, msg: 'Fields changed successfully' })
})


// delete account
router.delete('/del-acc', async (req, res) => {
   const { pass, confpass } = req.body

   const db = new Database('', { User: User })

   const sp = db.validatePassword(pass, 0, 999)
   const spc = db.validatePassword(pass, 0, 999)
   if(pass !== confpass || !sp.success || !spc.success) return res.json({ success: false, msg: 'Enter passwords correctly' })

   const us = await db.isAuthed(req, 'User')
   const ver = db.verifyHash(pass, us.user.hash, us.user.salt)
   if(!ver) return res.json({ success: false, msg: 'Enter passwords correctly' })

   const result = await db.deleteDoc('User', req.session.passport.user);

   const msg = result ? 'Successfully deleted account' : 'Enter passwords correctly'
   if(result) req.logout()

   res.json({ success: result, msg: msg })
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


// delete one message
router.delete('/del-message/:id', async (req,res) => {
   const db = new Database('', { User: User })
   const currUser = await db.isAuthed(req, 'User')

   if(!currUser.result) res.json({ success: false, msg: 'You are not authorized to be here' })

   await db.deleteFromArray('User', currUser.user._id, 'messages', req.params.id)
   
   res.json(true)
})





// login failed helper
router.get('/failed', (req, res) => {
   res.json({ msg:'Incorrect username or password', success: false })
})

module.exports = router