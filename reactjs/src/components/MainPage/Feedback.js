import React from 'react'
import '../../css/Feedback.css'
import Button from '../Reusable/Button'
import { fetchPost } from '../../js/fetches'
import { useState } from 'react'
import { Loading } from '../../js/Loading'

const Feedback = () => {
   const [mail, setMail] = useState(null)

   function focus(e, str){
      const text = e.target.parentElement.children[0]

      if(str === 'in'){
         text.style.transform = 'translateX(32%)'
         text.style.textShadow = '0 0 4px blue, 0 0 8px blue'
      }else if(str === 'out' && e.target.value === ''){
         text.style.transform = 'translateX(0)'
         text.style.textShadow = 'none'
      }
   }

   function sendMail(e){
      e.preventDefault()

      const load = new Loading(e.target, false, 'loadgif')
      load.attach()

      const name = e.target.elements[0].value
      const mail = e.target.elements[1].value
      const textarea = e.target.elements[2].value

      fetchPost('/mailer', {
         "name": name,
         "mail": mail,
         "textarea": textarea
      })
      .then(data => {
         load.delete()
         setMail({
            msg: data.msg,
            class: data.success.toString()
         })

         if(data.success === true){
            e.target.elements[0].value = ''
            e.target.elements[1].value = ''
            e.target.elements[2].value = ''
         }

         setTimeout(() => {
            setMail(null)
         }, 3500);
      })
   }

   return (
      <section className='feedback'>
         <h2>Send us your feedback</h2>
         <form onSubmit={ sendMail }>
            {
               mail && <p id='mailp' className={mail.class}>{mail.msg}</p>
            }
            <section className='creds'>
               <div>
                  <h3>Your name <span>*</span></h3>
                  <input onFocus={ (e)=>focus(e,'in') } onBlur={ (e)=>focus(e,'out') } spellCheck='false' type='text' />
               </div>

               <div>
                  <h3>Mail address <span>*</span></h3>
                  <input onFocus={ (e)=>focus(e,'in') } onBlur={ (e)=>focus(e,'out') } spellCheck='false' type='text' />
               </div>
               <p>* fields are required</p>
            </section>     

            <section className='area'>
               <span className='txtarea'>*</span>
               <textarea spellCheck='false'></textarea>
            </section>

            <Button text='Submit' />
         </form>
      </section>
   )
}

export default Feedback
