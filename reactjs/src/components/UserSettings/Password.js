import React from 'react';
import '../../css/Password.css'
import Button from '../Reusable/Button';
import { AiFillEye } from 'react-icons/ai'
import { fetchPost } from '../../js/fetches';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../js/Loading';
import { useState } from 'react';

const Password = () => {
   const navigate = useNavigate()
   const [res, setRes] = useState(null)

   function passVisibility(e){
      const inp = e.target.parentElement.children[1]
      inp.classList.toggle('pass-active')

      if(inp.classList.contains('pass-active')){
         const span = document.createElement('span')
         e.target.appendChild(span)
         inp.type='text'
      }else{
         e.target.children[1].remove();
         inp.type='password'
      }
   }

   async function changePass(e){
      e.preventDefault()

      const load = new Loading(e.target, false, 'loadgif')

      try{
         load.attach()

         const [oldpass, newpass, confnewpass] = [...e.target.elements].map(x => x.value)
      
         const data = await fetchPost('/api/users/change-password', { oldpass, newpass, confnewpass }, 'PUT')
         setRes({ cname: data.success, msg: data.msg })
         setTimeout(() => {
            setRes(null)
         }, 3000);       

         if(data.success) window.location.href='/login'
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{ load.delete() }
   }

   return (
      <>
         <p className='pinf'>Change your password</p>
         <p className='pinf pred'>You will be logged off</p>
         <form onSubmit={ changePass } className='password-change'>
            {
               res && <div id='resdiv' className={ (res.cname).toString() }>{ res.msg }</div>
            }
            <div>
               <p>Enter your old password</p>
               <input type='password' />
               <span onClick={passVisibility}> <AiFillEye /> </span>
            </div>
            <div>
               <p>Enter new password</p>
               <input type='password' />
               <span onClick={passVisibility}> <AiFillEye /> </span>
            </div>
            <div>
               <p>Confirm new password</p>
               <input type='password' />
               <span onClick={passVisibility}> <AiFillEye /> </span>
            </div>
            <Button text='Save changes' cname='save-name' />
         </form>
      </>
   )
};

export default Password;
