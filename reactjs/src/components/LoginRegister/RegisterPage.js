import React from 'react'
import '../../css/LogReg.css'
import Button from '../Reusable/Button'
import { FiUserPlus } from 'react-icons/fi'
import ReCAPTCHA from 'react-google-recaptcha'
import { fetchPost } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Loading } from '../../js/Loading'
import { AiFillEye } from 'react-icons/ai'
import { passwordVisible } from '../../js/passwordVisible'

const RegisterPage = () => {
   const navigate = useNavigate()
   const [reg, setReg] = useState(null)

   function registerClick(e){
      e.preventDefault()
      console.log(e.target)
      
      const load = new Loading(e.target, false, 'loadgif')
      load.attach()
      
      const elements = [...e.target.elements]
      const values = elements.map(x => x.value)
      values[4] = e.target.elements.check.checked

     fetchPost('/api/users/register', values)
     .then(data => {
         load.delete()
         if(data.success === false){
            setReg({ class: 'false', msg: data.errors })
            window.grecaptcha.reset()
         }else{
            setReg({ class: 'true', msg: data.successMessage })
            elements.forEach((x, ind) => {
               if(ind === 4) x.checked = false
               if(ind === 5){
                  window.grecaptcha.reset()
                  return
               }
               else x.value = ''
            })
         } 
         
         setTimeout(() => {
            setReg(null)
         }, 4000);
     })
     .catch(err => { navigate('/error', { state: { msg: err.message, code: err.code } }) })
   }

   return (
      <main className='registerpage'>
         <form onSubmit={ registerClick }>
            <div className='icon'> <FiUserPlus /> </div>

            <h3>Create new account</h3>

            {
               reg && (
                  <section className='msgCont'>
                     {
                        reg.msg.map((x, ind) => (
                           <span key={ ind } className={ reg.class }>{ x }</span>
                        ))
                     }
                  </section>
               )
            }

            <div>
               <p>Nickname</p>
               <input type='text' />
            </div>

            <div>
               <p>E-mail</p>
               <input type='text' />
            </div>

            <div>
               <p>Password</p>
               <input type='password' />
               <span onClick={ passwordVisible } className='passeye'><AiFillEye /></span>
            </div>

            <div>
               <p>Confirm password</p>
               <input type='password' />
               <span onClick={ passwordVisible } className='passeye'><AiFillEye /></span>
            </div>

            <div className='checkdiv'>
               <label htmlFor='check'>Accept our regulamin</label>
               <input id='check' type='checkbox' />
            </div>

            <ReCAPTCHA sitekey='6LcWTUIcAAAAAE4rGmd4V3oWtOX6Te1VPZ8891hr' />

            <Button text='REGISTER' cname='regbtn' />

            <h4>Have an account? <a href='/login'>Sign in here</a></h4>

         </form>
      </main>
   )
}

export default RegisterPage
