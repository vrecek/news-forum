import React from 'react';
import '../../css/UserSettings.css'
import { AiTwotoneSetting,AiOutlineUserDelete } from 'react-icons/ai'
import { useState, useRef, useEffect } from 'react'
import Nickname from './Nickname';
import Mail from './Mail';
import Password from './Password';
import DeleteAcc from './DeleteAcc';
import NameSurname from './NameSurname';
import { fetchGet } from '../../js/fetches';
import { Loading } from '../../js/Loading';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
   const [sect, setSect] = useState(null)
   const [usname, setUsname] = useState(null)
   const [usmail, setUsmail] = useState(null)
 
   const ulref = useRef(null)
   const navigate = useNavigate()
   let prev = null

   useEffect(() => {
      ulref.current.childNodes.forEach((x,i) => x.addEventListener('click', (e)=>select(i,e)))
      prev = ulref.current.children[0]

      const init = async() => {
         const load = new Loading(document.body, true)

         try{        
            load.attach()
   
            const data = await fetchGet('/api/users/is-authed')
            if(!data.result){
               const err = new Error('You are not authorized to be here')
               err.code = 401
               throw err
            }

            setUsname(data.user.username)
            setUsmail(data.user.mail)
   
            setSect(<Nickname user_name={ data.user.username } />)
         }catch(err){
            navigate('/error', { state: { msg: err.message, code:err.code } })
         }finally{
            load.delete()
         }
      }
      init()
   }, [usname, usmail, navigate])

   function select(nr,e){
      prev.classList.remove('active');
      prev = e.target
      prev.classList.add('active')

      switch(nr){     
         case 0: setSect(<Nickname user_name={ usname } />)
         break;

         case 1: setSect(<Mail user_mail={ usmail } />)
         break;

         case 2: setSect(<NameSurname />)
         break;

         case 3: setSect(<Password />)
         break;

         case 4: setSect(<DeleteAcc />)
         break;

         default: break;
      }
   }

   return (
     <main className='usersettings'>
         <div className='sett-wrap'>
            <h1 className='titlesettings'> <AiTwotoneSetting /> User settings <AiTwotoneSetting /></h1>
            <div className='main-cont'>
               <section className='lefts'>
                  <ul ref={ ulref }>
                     <li className='active'>Nickname</li>
                     <li>Mail address</li>
                     <li>Personal info</li>
                     <li>Password</li>             
                     <li className='del-acc'> <AiOutlineUserDelete /> Delete account <AiOutlineUserDelete /> </li>
                  </ul>
                  <div>
                     <p>&copy; All rights reserved &copy;</p>      
                     <p>Dolore inc. 2022</p>
                  </div>               
               </section>

               <section className='rights'>

                  <div>
                     { sect }
                  </div>

               </section>
            </div>
         </div>     
     </main>
  )
}

export default UserSettings;

