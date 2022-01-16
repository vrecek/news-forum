import React from 'react'
import '../../css/LogReg.css'
import { BiLogInCircle } from 'react-icons/bi'
import { AiFillEye } from 'react-icons/ai'
import Button from '../Reusable/Button'
import { passwordVisible } from '../../js/passwordVisible'
import { fetchPost } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Loading } from '../../js/Loading'

const LoginPage = () => {
   const [log, setLog] = useState(null)
   const navigate = useNavigate()
   function loginClick(e){
      e.preventDefault()

      const load = new Loading(e.target, false, 'loadgif')    
      load.attach()

      const body = {
         username: e.target.elements[0].value,
         password: e.target.elements[1].value,
         remember: e.target.elements[2].checked,
      }
      
      fetchPost('/api/users/login', body)
      .then(data => {
         if(!data.success){ 
            setLog(data.msg)
            setTimeout(() => {
               setLog(null)
            }, 4000);
         }
         else window.location.href = '/'
      })
      .catch(err => { navigate('/error', { state: { msg: err.message, code: err.code } }) })
      .finally(() => load.delete())
   }

   return (
      <main className='loginpage'>
         <form onSubmit={ loginClick }>
            <div className='icon'> <BiLogInCircle /> </div>

            <h3>Sign into account</h3>

            {
               log && (
                  <section className='msgCont'>
                     <span className='false logspan'>{ log }</span>
                  </section>
               )
            }

            <div>
               <p>Nickname</p>
               <input className='logininp' type='text' />
            </div>

            <div>
               <p>Password</p>
               <input className='logininp' type='password' />
               <span onClick={ passwordVisible } className='passeye'><AiFillEye /></span>
            </div>

            <div className='checkdiv'>
               <label htmlFor='check'>Remember me: </label>
               <input id='check' type='checkbox' />
            </div>

            <Button text='SIGN IN' cname='regbtn' />

            <h4 className='forg-pass'> <a href='/'>Forgot password?</a> </h4>
            <h4>No account? <a href='/register'>Create one here</a></h4>

         </form>
      </main>
   )
}

export default LoginPage
