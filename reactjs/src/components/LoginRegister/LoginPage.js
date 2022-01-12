import React from 'react'
import '../../css/LogReg.css'
import { BiLogInCircle } from 'react-icons/bi'
import { AiFillEye } from 'react-icons/ai'
import Button from '../Reusable/Button'
import { passwordVisible } from '../../js/passwordVisible'

const LoginPage = () => {
   function loginClick(e){
      e.preventDefault()
      
      console.log(e.target.elements)
   }

   return (
      <main className='loginpage'>
         <form onSubmit={ loginClick }>
            <div className='icon'> <BiLogInCircle /> </div>

            <h3>Sign into account</h3>

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
