import React from 'react';
import '../../css/DeleteAcc.css'
import { AiFillEye } from 'react-icons/ai'
import Button from '../Reusable/Button';
import { fetchPost } from '../../js/fetches';
import { useState } from 'react';
import { Loading } from '../../js/Loading';
import { useNavigate } from 'react-router-dom'

const DeleteAcc = () => {
   const [res,setRes] = useState(null)
   const navigate = useNavigate()

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

   async function delAcc(e){
      e.preventDefault()

      const load = new Loading(e.target, false, 'loadgif')
      try{
         load.attach()
         const [pass, confpass] = [...e.target.elements].map(x => x.value)
      
         const data = await fetchPost('/api/users/del-acc', { pass, confpass }, 'DELETE')
         
         setRes({ msg: data.msg, cname: data.success })
         setTimeout(() => {
            setRes(null)
         }, 2000);
         
         if(data.success) window.location.href = '/'
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{ load.delete() }
   }

   return (
      <form onSubmit={ delAcc } className='deleteacc'>
         <h3>Delete your account</h3>
         <h3 className='redh'>This process cannot be reversed</h3>
         <section>
            {
               res && <h4 className={ (res.cname).toString() }>{ res.msg }</h4>
            }
            <div>
               <p>Enter your password</p>
               <input type='password' />
               <span onClick={passVisibility}> <AiFillEye /> </span>
            </div>
            <div>
               <p>Confirm your password</p>
               <input type='password' />
               <span onClick={passVisibility}> <AiFillEye /> </span>
            </div>
            <Button text='Delete account' cname='n' />
         </section>
      </form>
   )
};

export default DeleteAcc;
