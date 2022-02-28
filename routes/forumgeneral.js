const express = require('express')
const router = express.Router()
const multer = require('multer')
const Database = require('../Database')
const fg = require('../schema/ForumGeneral')
const User = require('../schema/User')

const fs = require('fs')
const path = require('path')

const appendImageSrcArr = async obj => {
   const arr = []

   for(let x of obj){
      const copy = {...x._doc}
      copy.uploadedImagesString = []

      for(let y of copy.uploadedImages){
         const src = Database.bufferToImg(y).source
         copy.uploadedImagesString.push(src)
      }
      
      arr.push(copy)
   }
   return new Promise((resolve, reject) => resolve(arr))
}

const upload = multer({ dest: 'uploads/forumgeneral' })
router.post('/', upload.array('artImgs'), async (req, res) => {
   const db = new Database('/', { fg: fg, User: User })
   const {title, text} = req.body
   const user = await db.isAuthed(req, 'User')
   const authorAvatarString = Database.bufferToImg(user.user.avatar)

   if(!user.result){
      res.statusMessage = 'You are not authorized'
      return res.status(401).end()
   }

   if(!title || !text){
      res.statusMessage = 'Either title or text is empty'
      return res.status(400).end()
   }

   const imgs = []
   for(let x of req.files){
      if(x.mimetype !== 'image/png' && x.mimetype !== 'image/jpeg'){
         res.statusMessage = 'Wrong image type. Available: PNG, JPG/JPEG'
         return res.status(400).end()
      }

      imgs.push({
         data: fs.readFileSync(path.join(__dirname, '..', 'uploads', 'forumgeneral', x.filename)),
         contentType: x.mimetype
      })
   }

   const post = await db.createOne('fg', false, {
      title: Database.escapeCharacters(title),
      text: Database.escapeCharacters(text),
      uploadedImages: imgs,
      postAuthor: {
         name: user.user.username,
         avatar: {
            mime: authorAvatarString.content,
            convertedSrc: authorAvatarString.source
         }
      }
   })

   res.statusMessage = post.toString()
   res.status(201).end()
})

router.get('/:pageNr', async (req, res) => {
   const db = new Database('', { fg: fg })

   const c = await db.returnCount('fg')
   const pn = Database.calcPageNumber(c, 3, true)

   if(isNaN(req.params.pageNr) || req.params.pageNr > pn.length){
      res.statusMessage = 'Page not found'
      return res.status(404).end()
   }

   const posts = await db.displayPageItems('fg', req.params.pageNr, 3)
   const upd = await appendImageSrcArr(posts)
   
   res.json({ posts: upd, pnum: pn })
})

router.get('/post/:id', async (req, res) => {
   const db = new Database('', { fg: fg })
   try{
      const post = await db.viewOne('fg', req.params.id)
      const upd = await appendImageSrcArr([post])
      res.json(upd)

   }catch(err){
      console.log(err)
      res.statusMessage = 'Could not find post'
      res.status(404).end()
   }
})

router.put('/rate/:type/:id/:currUser', async (req, res) => {
   const db = new Database('', { fg: fg, User: User })
   const post = await db.viewOne('fg', req.params.id)

   if(!req.params.currUser){
      return res.status(401).json({ success: false, msg: 'You are not logged' })
   }

   try{
      if(req.params.type === 'like'){
         if(post.whoLiked.some(x => x === req.params.currUser)){
            return res.json({ success: false, msg: 'You already liked this' })
         }

         if(post.whoDisliked.some(x => x === req.params.currUser)){
            await db.updateOne('fg', { _id: req.params.id }, 'dislikes', -1, false, true)
            await db.deleteFromArray('fg', req.params.id, 'whoDisliked', req.params.currUser, true)
         }
         await db.updateOne('fg', { _id: req.params.id }, 'likes', 1, false, true)
         await db.updateOne('fg', { _id: req.params.id }, 'whoLiked', req.params.currUser, true)
   
      }else if(req.params.type === 'dislike'){
         if(post.whoDisliked.some(x => x === req.params.currUser)){
            return res.json({ success: false, msg: 'You already disliked this' })
         }

         if(post.whoLiked.some(x => x === req.params.currUser)){
            await db.updateOne('fg', { _id: req.params.id }, 'likes', -1, false, true)
            await db.deleteFromArray('fg', req.params.id, 'whoLiked', req.params.currUser, true)
         }
         await db.updateOne('fg', { _id: req.params.id }, 'dislikes', 1, false, true)
         await db.updateOne('fg', { _id: req.params.id }, 'whoDisliked', req.params.currUser, true)
      }

   }catch(err){
      res.json({ success: false, msg: err.message })
   }  

   res.json({ success: true, msg: 'Rated' })
})

router.put('/addFav/:id/:currUser', async (req, res) => {
   const db = new Database('', { fg: fg, User: User })
   const post = await db.viewOne('fg', req.params.id)

   const isFav = post?.whosFav.some(x => x === req.params.currUser)
   try{
      if(isFav){
         await db.deleteFromArray('fg', req.params.id, 'whosFav', req.params.currUser, true)
         return res.json({ success: true, msg: 'Removed from favourites' })
      }else{
         await db.updateOne('fg', { _id: req.params.id }, 'whosFav', req.params.currUser, true)
         return res.json({ success: true, msg: 'Added to favourites' })
      }

   }catch(err){
      res.json({ success: false, msg: err.message })
   }
})

router.delete('/del-comm', async (req, res) => {
   const { commId, postId, authorName, currentUser } = req.body
   
   if(authorName !== currentUser){
      return res.json({ success:false })
   }

   const db = new Database('', { fg: fg })

   try{
      await db.deleteFromArray('fg', postId, 'comments', commId)
      res.json({ success: true })

   }catch(err){
      res.json({ success: false, msg: err.message })
   }
})

router.put('/rate-comm', async (req, res) => {
   const { txt, id, user } = req.body

   if(!txt){
      return res.json({ success: false, msg: 'Text area is empty' })
   }

   const date = Database.convertDefaultDate( {}, new Date(Date.now())).data

   const comm = {
      author: {
         name: user.user.username,
         avatar: {
            mime: user.user.avatar.contentType,
            convertedSrc: user.user.avatarString
         }
      },
      convertedDateTime: date,
      text: Database.escapeCharacters(txt)
   }

   const db = new Database('', { fg: fg })
   await db.updateOne('fg', { _id: id }, 'comments', comm, true)

   res.json({ success: true, msg: 'Successfully commented' })
})

router.put('/like-comm', async (req, res) => {
   const { whoLiked, currentUser, postId, commId } = req.body

   if(!currentUser){
      res.statusMessage = 'Log in to like'
      return res.status(401).end()
   }

   const db = new Database('', { fg: fg })

   if(!whoLiked.includes(currentUser)){
      await db.updateArray('fg', postId, 'comments', commId, 'likes', -1, false, true)
      await db.deleteFromArray('fg', postId, 'comments', commId, false, 'whoLiked', currentUser)

      return res.status(201).json(true)
   }

   await db.updateArray('fg', postId, 'comments', commId, 'likes', 1, false, true)
   await db.updateArray('fg', postId, 'comments', commId, 'whoLiked', currentUser, true)

   res.status(201).json(true)
})

module.exports = router