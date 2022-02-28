import React from 'react'
import '../../../css/WriteNew.css'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import Button from '../../Reusable/Button'
import { Loading } from '../../../js/Loading'
import { useState, useRef, useEffect } from 'react'
import { fetchGet } from '../../../js/fetches'
import { useNavigate } from 'react-router-dom'

const WriteNew = () => {
   const [sendRes, setSendRes] = useState(null)
   const textcont = useRef()
   const navigate = useNavigate()

   useEffect(() => {
      (async function init(){
         try{
            const auth = await fetchGet('/api/users/is-authed')
            if(!auth.result){
               const err = new Error('You are not authorized. Login to post')
               err.code = 401
               throw err
            }
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }
      })()
   }, [])

   const sendMainArticle = async e => {
      e.preventDefault()

      const [title, text] = [...e.target.elements].filter(x => x.className !== 'cimg').map(x => x.value)
      const imgs = [...e.target.elements].filter(x => x.className === 'cimg')

      const formdata = new FormData()
      imgs.forEach(x => formdata.append('artImgs', x?.files[0]))
      formdata.append('title', title)
      formdata.append('text', text)

      const load = new Loading([...e.target.elements].slice(-1).pop(), false, 'loadgif')
      load.attach()

      try{
         for(let x of imgs){
            if(!x?.files[0]){
               setSendRes({ success: false, msg: 'Empty image. Either remove one or select image' })
               setTimeout(() => setSendRes(null), 3000)
               return
            }
         }

         if(!title || !text){
            setSendRes({ success: false, msg: 'Either title or text is empty' })
            setTimeout(() => setSendRes(null), 3000)
            return
         }

         const data = await fetch('/api/forumgeneral', {
            method: 'POST',
            body: formdata
         })
         
         setSendRes({ success: data.ok, msg: 'Successfully created a post', id: data.statusText })
         if(!data.ok) setTimeout(() => setSendRes(null), 3000)
         
      }catch(err){
         setSendRes({ success: false, msg: err.message })

      }finally{
         load.delete()
      }
   }

   const remImg = e => {
      const container = e.target.parentElement.parentElement.children[1]
      if(!container.lastChild) return

      container.lastChild.remove()
   }

   const addImg = e => {
      const container = e.target.parentElement.parentElement.children[1]

      const input = document.createElement('input')
      input.className = 'cimg'
      input.type = 'file'
      input.onchange = e => {
         if(e.target?.isactive) return

         e.target.isactive = true
         if(!textcont.current.value){
            textcont.current.value += `{-up}${ container.children.length }{up-}\r\n`
            
         }else textcont.current.value += `\r\n{-up}${ container.children.length }{up-}\r\n`
         
      }
      container.appendChild(input)
   }

   return (
      <main className='write-new-main'>
         <form onSubmit={ sendMainArticle }>
            { 
               sendRes && !sendRes.success && <h2 className={ sendRes.success.toString() }>{ sendRes.msg }</h2>
            }
            { 
               sendRes && sendRes.success && 
               <h2 className={ sendRes.success.toString() }>
                  { sendRes.msg }
                  <span onClick={ () => window.location.href=`/forum/main/1/${ sendRes.id }` }>Check it there</span>
               </h2>
            }

            <h1>Create new article for general section</h1>

            <section className='wnm-title'>
               <h3>Title</h3>
               <input type='text' />
            </section>

            <section className='wnm-img'>
               <h3>Upload image(s) - optional</h3>

               <div className='wnm-img-cont'>
                  
               </div>

               <div className='wnm-img-opt'>
                  <span onClick={ remImg }> <AiOutlineMinus /> </span>
                  <span onClick={ addImg }> <AiOutlinePlus /> </span>
               </div> 
            </section>

            <section className='wnm-text'>
               <h3>Text</h3>
               <textarea spellCheck='false' ref={ textcont }></textarea>
            </section>

            <Button text='Send' />
         </form>
      </main>
   )
}

export default WriteNew