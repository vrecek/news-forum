const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()

router.post('/', async (req,res) => {
   try{
      const { name, mail, textarea } = req.body

      if(!name || !mail || !textarea) throw new Error('All fields are required.')

      const transporter = await nodemailer.createTransport({
         service: 'gmail',
         auth: {
            type: "OAuth2",
            user: process.env.MAIL,
            clientId: process.env.CL_ID,
            clientSecret: process.env.MAIL_SECRET,
            refreshToken: process.env.REF_TOK
         },
         tls: {
            rejectUnauthorized: false
         }
      })
      
      const mailOptions = {
         from: `${name} <${process.env.MAIL}>`,
         to: process.env.MAIL,
         subject: 'Blog/Forum Opinion',
         html: 
         `<h1>User info:</h1>
         <h2>mail: ${mail}</h2>
         <h2>nick: ${name}</h2>
         <h4>${textarea}</h4>
         `
      }
   
      await transporter.sendMail(mailOptions);
   
      res.json({ msg: 'Mail sucessfully sent', success: true })

   }catch(err){
      if(err.code === 'EAUTH') return res.json({ msg: 'Authorization failed. Try again later or contact us directly.', success: false })

      return res.json({ msg: err.message, success: false })
   }
})

module.exports = router