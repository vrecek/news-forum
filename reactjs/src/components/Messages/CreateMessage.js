import React from 'react'
import '../../css/FormMessage.css'
import Button from '../Reusable/Button'
import { FaTimes } from 'react-icons/fa'
import { AiOutlineSend } from 'react-icons/ai'
import { fetchPost } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { Loading } from '../../js/Loading'

const CreateMessage = ({ toggleF, refere, is_this_answer, is_profile_send }) => {
   const navigate = useNavigate()
   const [res, setRes] = useState(null)
   const emoteRef = useRef(null)

   useEffect(() => {
      [...emoteRef.current.children].forEach(it => {
         it.addEventListener('click', e => emoteRef.current.parentElement.children[0].value += it.textContent)
      })
   }, [])

   useEffect(() => {
      if(is_profile_send){
         const userQuery = window.location.pathname.replace(/\/user\//ig, '')
         const [toa] = refere.current.elements
         
         toa.parentElement.children[0].style.top = '0'
         toa.value = userQuery
         toa.style.pointerEvents = 'none'
         toa.style.borderColor = 'rgb(0, 233, 0)'
         toa.parentElement.children[0].style.color = 'rgb(0, 233, 0)'
      }
   }, [is_profile_send])

   useEffect(() => {
      if(is_this_answer){
         const [toa, titlea] = refere.current.elements

         toa.parentElement.children[0].style.top = '0'
         toa.value = is_this_answer.to
         toa.style.pointerEvents = 'none'
         toa.style.borderColor = 'rgb(0, 233, 0)'
         toa.parentElement.children[0].style.color = 'rgb(0, 233, 0)'

         let titleEdit = is_this_answer.title
         const spl = titleEdit.split(' ')
         if(spl[0] === spl[1]){
            titleEdit = titleEdit.slice(spl[0].length + 1)
         }

         titlea.parentElement.children[0].style.top = '0'
         titlea.value = titleEdit
         titlea.style.pointerEvents = 'none'
         titlea.style.borderColor = 'rgb(0, 233, 0)'
         titlea.parentElement.children[0].style.color = 'rgb(0, 233, 0)'
      }
   },[is_this_answer])

   function focusF(e){
      const span = e.target.parentElement.children[0]    
      span.style.top = '0'
   }

   function blurF(e){
      const span = e.target.parentElement.children[0]
      const val = e.target.value

      if(e.target.classList.contains('textarea')){
         val === '' ? e.target.style.borderColor = '#dfdfdf' : e.target.style.borderColor = 'rgb(0, 233, 0)'
         return
      } 
      
      if(val === ''){ 
         span.style.top = '50%'
         e.target.style.borderColor = '#dfdfdf'
         span.style.color = 'white'
      }else{
         e.target.style.borderColor = 'rgb(0, 233, 0)'
         span.style.color = 'rgb(0, 233, 0)'
      }
   }

   async function sendMessage(e){
      const loads = new Loading(e.target.parentElement, false, 'loadgif')
      loads.attach()

      try{
         e.preventDefault()

         const [to, title, text] = [...e.target.parentElement.elements].map(x => x.value)
   
         const data = await fetchPost('/api/users/send-message', { to, title, text }, 'PUT')

         setRes({ classname: data.success, msg: data.msg })

         if(data.success && !is_profile_send){
            [...e.target.parentElement.elements].forEach((x, i) => {
               x.value = ''
               if(i === 3) return
               x.style.borderColor = '#dfdfdf'
               x.parentElement.children[0].style.color = '#dfdfdf'
            })
         }

         setTimeout(() => {
            setRes(null)
         }, 4000);
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{
         loads.delete()
      }  
   }

   return (
      <form ref={ refere } className='formmessage'>
         <span className='close-icon' onClick={ toggleF }><FaTimes /></span>
         <h1 className='write-inf'>Write a message</h1>
         {
            res && <h1 className='res' id={ res.classname.toString() }>{ res.msg }</h1>
         }
         <div>
            <span>To (nickname):</span>
            <input onBlur={ blurF } onFocus={ focusF } type='text' />
         </div>

         <div>
            <span>Topic:</span>
            <input onBlur={ blurF } onFocus={ focusF } type='text' />
         </div>

         <div>
            <textarea spellCheck='false' className='textarea' onBlur={ blurF }></textarea>
            <div ref={ emoteRef } className='emotes-bar'>
               <h2>👌</h2>
               <h2>📋</h2>
               <h2>😋</h2>
               <h2>😜</h2>
            </div>
         </div>

         <Button action={ sendMessage } additional={ <AiOutlineSend /> } cname='n' text='SEND' />
      </form>
   )
}

export default CreateMessage
