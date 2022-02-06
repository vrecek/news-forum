import React from 'react'
import { fetchGet } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Loading } from '../../js/Loading'
import '../../css/UserMessages.css'
import Message from './Message'
import Button from '../Reusable/Button'
import CreateMessage from './CreateMessage'

const UserMessages = () => {
   const navigate = useNavigate()
   const [user, setUser] = useState(null)
   const [loaded, setLoaded] = useState(null)
   const [formT, setFormT] = useState(false)
   const ref = useRef(null)

   function refresh(id){
      const deletedFilter = user.messages.filter(x => x._id !== id)
      const obj = { messages: deletedFilter }
      setUser(obj)
   }

   function toggleForm(){
      if(formT){
         setFormT(false)
         ref.current.style.transform='translate(-50%,-50%) scale(0)'
      }
      else{ 
         setFormT(true)
         ref.current.style.transform='translate(-50%,-50%) scale(1)'
      }
   }

   useEffect(() => {
      const load = new Loading(document.body, true)
      load.attach()

      fetchGet('/api/users/is-authed')
      .then(data => {
         if(data.result){ 
            setLoaded(true)
            setUser(data.user)
         }
         else{
            const err = new Error('You are unauthorized to view this page.')
            err.code = 401
            throw err
         }
      })
      .catch(err => { navigate('/error', { state: { msg: err.message, code: err.code } }) })
      .finally(() => load.delete())
   }, [navigate])

   if(loaded)
   return (
      <main className='messages'>

         { <CreateMessage refere={ ref } toggleF={ toggleForm } /> }

         <h1>There are your messages</h1>
         <section>
            <div className='topCont'>
               <h3>Total messages: <span>{ user ? user.messages.length : '0' }</span></h3>
               <Button action={ toggleForm } cname='n' text='Write message' />
            </div>
            
            { user &&
               user.messages.length !== 0 ?
                  user.messages.map((x, ind) => (
                     <Message
                        id={ x._id }
                        key={ ind } title={ x.title } 
                        date={ x.dateTime } 
                        from={ x.from } 
                        status={ x.viewed } 
                        ajax={ refresh }
                     />
                  ))
               :
               <h1>You have no messages</h1>
            }
         </section>
      </main>
   )

   else
   return (
      <main className='messages'>
         
      </main>
   )
}

export default UserMessages
