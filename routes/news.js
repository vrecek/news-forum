const express = require('express')
const router = express.Router()

const Database = require('../Database')
const News = require('../schema/News')


/* RETURN ALL NEWS */
router.get('/', async (req, res) => {
   try{
      const db = new Database(process.env.DB, { News: News } )
      const views = await db.viewAll('News')
      res.json(views)
   }catch(err){
      res.json({ msg: err.message, ok: false, code: err.code })
   }
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

module.exports = router