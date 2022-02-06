const express = require('express')
const router = express.Router()

const Database = require('../Database')
const News = require('../schema/News')
const User = require('../schema/User')

const path = require('path')
const fs = require('fs')
const multer = require('multer')

const buffimage = async obj => {
   const imageBuf = Database.bufferToImg(obj.image)
   obj.image.data = imageBuf.source
}

/* RETURN ALL NEWS */
router.get('/', async (req, res) => {
   try{
      const db = new Database(process.env.DB, { News: News } )
      const views = await db.viewAll('News', {
         limit: 3
      })

      const changedDate = Database.convertDefaultDate(views, 'data')
      for await(let x of changedDate){
         buffimage(x)
      }

      res.json(changedDate)
   }catch(err){
      res.json({ msg: err.message, ok: false, code: err.code })
   }
})


/* RETURN NEWS BASED ON 'PAGE NUMBER' */
router.get('/page/:nr', async (req,res) => {
   const db = new Database('', { News: News })
   const news = await db.displayPageItems('News', req.params.nr, 3)

   const changedDate = Database.convertDefaultDate(news, 'data')
   for await(let x of changedDate){
      buffimage(x)
   }

   res.json(changedDate)
})


/* RETURN ONE ITEM */
router.get('/get-one/:id', async (req,res) => {
   const db = new Database('', { News: News, User: User })
   let gotNews = null
   
   try{
      gotNews = await db.viewOne('News', req.params.id, '_id')
      if(!gotNews) throw new Error('')

   }catch(err){
      const replacedash = req.params.id.replace(/-/g, ' ')

      try{
         gotNews = await db.viewOne('News', replacedash, 'shortTitle')
         
      }catch(err){
         res.statusMessage = 'URL not found'
         return res.status(404).end()
      }
      
      gotNews = gotNews[0]

   }
      if(gotNews?.data){
         const upd = Database.convertDefaultDate(gotNews, gotNews.data)
         const author = await db.viewOne('User', upd.author?.nickname, 'username')
   
         await buffimage(upd)

         return res.json(upd)
      }
   
      res.json(gotNews)
})


// ADD NEW ARTICLE NEWS
router.post('/', async (req,res) => {
   const [ title, shortTitle, , category, text, ...tags ] = req.body

   if(!title || !shortTitle || !category || !text || tags.some(x => x === '')){
      return res.json({ success: false, msg: 'Must fill every field' })
   }

   const db = new Database('', { News: News, User: User })

   const vt = db.validateNick_AlphaNumeric(title, 10, 60, false, true).errMsg.replace('Nickname', 'Title')
   const vst = db.validateNick_AlphaNumeric(shortTitle, 5, 20).errMsg.replace('Nickname', 'Short title')
   const errTitles = vt || vst
   
   if(errTitles){
      return res.json({ success: false, msg: errTitles })
   }

   for(let x of tags){
      const result = db.validateNick_AlphaNumeric(x, 3, 15)
      if(!result.success){
         return res.json({ success: false, msg: result.errMsg.replace('Nickname', 'Tag(s)') })
      }
   }

   const currUser = await db.isAuthed(req, 'User')
   const { firstname, lastname, username, avatar } = currUser.user
   const userAvatar = Database.bufferToImg(avatar)

   await db.createOne('News', false, {
      title: title,
      shortTitle: shortTitle,
      tags: tags,
      category: category,
      text: Database.escapeCharacters(text),
      author: {
         firstname: firstname,
         lastname: lastname,
         nickname: username,
         avatar: {
            source: userAvatar.source,
            contentType: userAvatar.content
         },
      }
   })

   res.json({ success: true, msg: 'Successfully created!' })
})


// ADD NEW ARTICLE NEWS IMAGE
const upload = multer({ dest: 'uploads/article_image' })
router.post('/:shortTitle', upload.single('artBack'), async (req,res) => {
   if(req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg'){
      res.statusMessage = 'Wrong image extension, available: png, jpg/jpeg'
      res.success = false
      return res.status(400).end()
   }

   const db = new Database('', { News: News })
   const newPosted = await db.viewOne('News', req.params.shortTitle, 'shortTitle')

   await db.updateObject('News', newPosted[0]._id, 'image', 'data', fs.readFileSync(path.join(__dirname, '..', 'uploads', 'article_image', req.file.filename)))
   await db.updateObject('News', newPosted[0]._id, 'image', 'contentType', req.file.mimetype)

   res.statusMessage = 'Successfully created'
   res.status(200).end()
})


/* SEARCH BAR */
router.get('/search/:str', async (req, res) => {
   try{
      const db = new Database(process.env.DB, { News: News })
      const srchResult = await db.viewAll('News', {
         string: req.params.str,
         searchWhat: 'title tags',
         returnValue: 'shortTitle',
         limit: 5
      })
      res.json(srchResult)
   }catch(err){
      res.json({ msg: err.message, ok: false, code: err.code })
   }
})


/* CALC NUMBER OF PAGES */
router.get('/pages', async (req,res) => {
   try{
      const db = new Database('', { News: News })
      const total = await db.returnCount('News')
      const max = 3

      const num = Database.calcPageNumber(total, max, true)

      res.json(num)
   }catch(err){
      res.json({ msg: err.message, ok: false, code: err.code })
   }
})

module.exports = router