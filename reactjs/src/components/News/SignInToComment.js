import React from 'react';
import { FaTimes } from 'react-icons/fa'
import Button from '../Reusable/Button';
import '../../css/SignInToComment.css'

const SignInToComment = ({ close }) => {
   return (
      <section className='logintocomment'>
         <div>
            <span onClick={ close }><FaTimes /></span>
            <h3>Sign in to leave opinion</h3>
            <Button
               action={ () => window.location.href = '/login' }
               text='Sign in'
               cname='n' 
            />
            <h4><span className='text'>or</span> <span className='line'></span></h4>
            <h3>Join to our community</h3>
            <Button 
               text='Register' 
               cname='n' 
               action={ () => window.location.href = '/register' }
            />
         </div>
      </section>
   )
};

export default SignInToComment;
