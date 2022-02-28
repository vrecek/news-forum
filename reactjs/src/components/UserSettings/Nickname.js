import React from 'react';
import '../../css/Nickname.css'
import Button from '../../components/Reusable/Button'
import { fetchPost, fetchGet } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { Loading } from '../../js/Loading';

const Nickname = ({ user_name }) => {
   const navigate = useNavigate()
   const [res, setRes] = useState(null)
   const [time, setTime] = useState(true)

   function* randomName(){
      const names = ['Lorem', 'Ipsum', 'Dolor', 'Amet', 'Conseqetaur']
      let copy = [...names]

      while(true){
         const i = Math.floor(Math.random() * copy.length)
         yield copy[i]
         copy.splice(i,1)

         if(copy.length === 0) copy = [...names]
      }
   }
   const name = randomName()

   function gen(e){
      e.preventDefault()

      const inp = e.target.parentElement.children[1];
      inp.value = name.next().value
   }

   async function changeNick(e){
      e.preventDefault()

      const load = new Loading(e.target.parentElement, false, 'loadgif')
      load.attach()
      try{
         const [newName,,confName] = [...e.target.elements].map(x => x.value);
         
         const data = await fetchPost('/api/users/change-nickname', { newName, confName }, 'PUT')
         setRes({ cname: data.success, msg: data.msg })
         setTimeout(() => {
            setRes(null)
         }, 3000);       

         if(data.success) window.location.reload()
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{ load.delete() }
      
   }

   useEffect(() => {
      async function init(){
         const load = new Loading(document.body, true)
         try{
            load.attach()
            const data = await fetchGet('/api/users/can-nickname')

            setTime({...data})
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete()}    
      }
      init()
   }, [navigate])

   return (
      <>
         <p className='p-inf'>From here you can change your nickname</p>
         <form onSubmit={ changeNick } className='wrap-name'>        
            {
               res && <div id='resdiv' className={ (res.cname).toString() }>{ res.msg }</div>
            }
            <section>
               <h3>Actual name: <span>{ user_name }</span></h3>
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
                  <h4>Set new name:</h4>
                  <input type='text' spellCheck='false' />
                  <Button action={ gen } text='Random name' cname='rand-name' />
               </div>
               <div className='div-name'>
                  <h4>Confirm name:</h4>
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
   );
};

export default Nickname;
