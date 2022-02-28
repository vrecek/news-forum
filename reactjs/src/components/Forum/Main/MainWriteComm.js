import React from 'react'
import '../../../css/MainWriteComm.css'
import Button from '../../Reusable/Button'
import { fetchPost } from '../../../js/fetches'
import { useState } from 'react'
import { Loading } from '../../../js/Loading'

const MainWriteComm = ({ id, user, ajax }) => {
   const [postres, setPostres] = useState(null)
   const [hasPosted, setHasPosted] = useState(null)

   const postComm = async e => {
      e.preventDefault()

      if(hasPosted){
         setPostres('You have already posted a comment')
         setTimeout(() => setPostres(null), 2000)
         return
      }

      const txt = e.target.elements[0].value
      const load = new Loading(e.target.elements[1], false, 'loadgif')

      try{
         load.attach()
         const res = await fetchPost('/api/forumgeneral/rate-comm', { txt, id, user }, 'PUT')
         
         if(res.success){
            ajax(user.user.username, txt, user.user.avatar.contentType, user.user.avatarString)
            setHasPosted(true)
            e.target.elements[0].value = ''
         }

         setPostres(res.msg)
         
      }catch(err){
         setPostres(err.messsge)

      }finally{ setTimeout(() => setPostres(null), 2000); load.delete() }   
   }

   return (
      <form onSubmit={ postComm } className='m-w-comm'>
         <section>
            <figure>
               <div>
                  {
                     user.result && user.user.avatar.contentType && user.user.avatarString ?
                     <img src={`data:image/${user.user.avatar.contentType};base64,${user.user.avatarString}`} />
                     :
                     <img src='https://iupac.org/wp-content/uploads/2018/05/default-avatar.png' />
                  }
               </div>
               <figcaption>{ user.result ? user.user.username : 'Not logged' }</figcaption>
            </figure>

            <textarea spellCheck='false'></textarea>
         </section>

         <Button text='Comment' cname='n' />

         { postres && <h5>{ postres }</h5> }
      </form>
   )
}

export default MainWriteComm