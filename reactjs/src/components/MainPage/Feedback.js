import React from 'react'
import '../../css/Feedback.css'
import Button from '../Reusable/Button'

const Feedback = () => {
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

   return (
      <section className='feedback'>
         <h2>Send us your feedback</h2>

         <form method='POST'>
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
