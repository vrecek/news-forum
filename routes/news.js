const express = require('express')
const router = express.Router()

const Database = require('../Database')
const News = require('../schema/News')


/* RETURN ALL NEWS */
router.get('/', async (req, res) => {
   try{
      const db = new Database(process.env.DB, { News: News } )
      const views = await db.viewAll('News', {
         limit: 3
      })
      res.json(views)
   }catch(err){
      res.json({ msg: err.message, ok: false, code: err.code })
   }
})

/* RETURN NEWS BASED ON 'PAGE NUMBER' */
router.get('/page/:nr', async (req,res) => {
   const db = new Database('', { News: News })
   const news = await db.displayPageItems('News', req.params.nr, 3)
   
   res.json(news)
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