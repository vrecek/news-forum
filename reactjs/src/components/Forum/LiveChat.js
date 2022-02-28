import React from 'react'
import '../../css/LiveChat.css'
import Button from '../Reusable/Button'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'

const LiveChat = ({ nick }) => {
   const [notlogged, setNotlogged] = useState(null)

   const msgcont = useRef()
   const socket = io('http://localhost:5000/')

   const sendChat = e => {
      e.preventDefault()

      const after = e.target.elements[1].children[0]
      after.classList.add('clickedanim')
      setTimeout(() => {
         after.classList.remove('clickedanim')
      }, 300);

      if(!nick){
         setNotlogged(true)
         setTimeout(() => setNotlogged(null), 2000);
      }

      const val = e.target.elements[0]
      if(!val.value) return

      socket.emit('chatMsg', { val: val.value, nick: nick })
      val.value = ''
   }

   useEffect(() => {
      socket.on('chatMsg', msg => {
         const h6 = document.createElement('h6')
         const span = document.createElement('span')
         span.appendChild( document.createTextNode(msg.data) )
         h6.appendChild( document.createTextNode(`${msg.nick} - `) )
         h6.appendChild(span)
         h6.onclick = () => window.location.href=`/user/${msg.nick}`

         const p = document.createElement('p')
         p.appendChild( document.createTextNode(msg.val) )

         const div = document.createElement('div')
         div.appendChild(h6)
         div.appendChild(p)

         msgcont?.current.prepend(div)
      })
   }, [])
 
   return (
      <section className='f-chat'>
         <h5>LiveChat</h5>

         <article ref={ msgcont }>

         </article>

         <form onSubmit={ sendChat }>
            <textarea spellCheck='false'></textarea>
            <Button text='Send' cname='n' />
            { notlogged && <p>Sign in to text</p> }
         </form>
      </section>
   )
}

export default LiveChat