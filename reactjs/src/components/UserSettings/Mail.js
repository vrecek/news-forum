import React from 'react';
import Button from '../Reusable/Button';
import { fetchPost, fetchGet } from '../../js/fetches';
import { Loading } from '../../js/Loading';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Mail = ({ user_mail }) => {
   const navigate = useNavigate()
   const [res, setRes] = useState(null)
   const [time, setTime] = useState(true)

   async function changeMail(e){
      e.preventDefault()

      const load = new Loading(e.target.parentElement, false, 'loadgif')
      load.attach()
      try{
         const [mail, mailconf] = [...e.target.elements].map(x => x.value)
      
         const data = await fetchPost('/api/users/change-mail', { mail, mailconf }, 'PUT')
         setRes({ cname: data.success, msg: data.msg })
         setTimeout(() => {
            setRes(null)
         }, 3000);       

         if(data.success) window.location.reload()
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{
         load.delete()
      }
   }

   useEffect(() => {
      async function init(){
         const load = new Loading(document.body, true)
         try{
            load.attach()
            const data = await fetchGet('/api/users/can-mail')

            setTime({...data})
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete() }   
      }
      init()
   }, [navigate])

   return (
      <>
         <p className='p-inf'>From here you can change your mail address</p>
         <form onSubmit={ changeMail } className='wrap-name'>
            {
               res && <div id='resdiv' className={ (res.cname).toString() }>{ res.msg }</div>
            }
            <section>
               <h3>Actual mail: <span>{ user_mail }</span></h3>
               {
                  time && time.passed ? 
                  <h3>Can change: <span className='nyes'>Yes</span></h3> 
                  : 
                  <>
                     <h3>Can change: <span className='nno'>No</span></h3>
                     <h3>Time left: <span className='nno'>{ time.day } day { time.hour } hour { time.minute } minutes</span></h3>
                  </>
               }
            </section>
            <section>
               <div className='div-name'>
                  <h4>Set new mail:</h4>
                  <input type='text' spellCheck='false' />
               </div>
               <div className='div-name'>
                  <h4>Confirm mail:</h4>
                  <input type='text' spellCheck='false' />
               </div>
               <div className='div-name secret-div'>
                  <h4>Enter your password:</h4>
                  <input type='text' spellCheck='false' />
               </div>
               <Button id={ time.passed ? '' : 'dis' } text='Save changes' cname='save-name' />
            </section> 
         </form> 
      </>  
   )
};

export default Mail;
