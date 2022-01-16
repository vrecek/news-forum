import React from 'react'
import '../../css/ReadMessage.css'
import Button from '../Reusable/Button'
import { RiMessage2Line } from 'react-icons/ri'
import { fetchGet } from '../../js/fetches'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'
import CreateMessage from './CreateMessage'

const ReadMessage = () => {
   const [msg, setMsg] = useState([])
   const [formT, setFormT] = useState(false)
   const [answerObj, setAnswerObj] = useState(null)
   const ref = useRef(null)
   const navigate = useNavigate()

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

      const path = window.location.pathname
      const id = path.slice(path.indexOf('s/') + 2)

      fetchGet(`/api/users/get-message/${id}`)
      .then(data => {
         const red = data.reduce((curr, next) => curr + next)
         setMsg(red)
         setAnswerObj({ to: red.from, title: `RE: ${ red.title }` })
      })
      .catch(err => navigate('/error', { state: { msg: err.message, code: err.code } }))
      .finally(() => load.delete())
   }, [navigate])

   return (
      <main className='msg-read'>

         { <CreateMessage is_this_answer={ answerObj } refere={ ref } toggleF={ toggleForm } /> }

         <article className='cont'>
            <section className='info'>
               <RiMessage2Line />

               <img src='https://barryburnett.net/wp-content/uploads/2018/03/Blank-Avatar-Man-in-Suit.jpg' alt='avatar' />
               <div>
                  <h4>From:</h4>
                  <span>{ msg.from }</span>
               </div>
               <div>
                  <h4>Recieved:</h4>
                  <span>{ msg.dateTime }</span>
               </div>
            </section>

            <section className='text'>
               <h1>{ msg.title }</h1>
               <p>{ msg.text }</p>
               <Button action={ toggleForm } cname='n' text='Answer' />
            </section>
         </article>
      </main>
   )
}

export default ReadMessage
