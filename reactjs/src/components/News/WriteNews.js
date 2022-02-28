import React from 'react';
import '../../css/WriteNews.css'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import Button from '../Reusable/Button'
import { useRef, useEffect, useState } from 'react'
import { fetchPost, fetchGet } from '../../js/fetches'
import { Loading } from '../../js/Loading'
import { useNavigate } from 'react-router-dom'

const WriteNews = () => {
   const [res, setRes] = useState(null)
   const navigate = useNavigate()

   const shortcutCont = useRef()
   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         try{
            load.attach()
            const is_auth = await fetchGet('/api/users/is-authed')
            if(!is_auth.result || is_auth.user.role === 'normal'){
               const err = new Error('You are not authorized')
               err.code = 401
               throw err
            }
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete() }
      })();

      [...shortcutCont.current.children].forEach(x => {
         x.addEventListener('click', (e) => {
            const area = e.target.parentElement.parentElement.children[0]

            switch(e.target.textContent){
               case 'bH':
                  area.value += '{-bh}{bh-}'
               break;

               case 'sH':
                  area.value += '{-sh}{sh-}'
               break;

               case 'Link':
                  area.value += "{-l::}{l-}"
               break;

               default: break;
            }
         })
      })
   }, [navigate])
   
   // onchange event
   function displayImage(e){
      const imgtag = e.target.parentElement.children[1].children[0]
      imgtag.className = ''
      imgtag.src = URL.createObjectURL(e.target.files[0])
   }

   // add tag field
   function addTag(e){
      const cont = e.target.parentElement

      const inputField = document.createElement('input')
      inputField.type = 'text'
      inputField.className = 'tag'
      inputField.spellcheck = 'false'
      cont.appendChild(inputField)
   }

   // delete tag field
   function delTag(e){
      const cont = [...e.target.parentElement.children]
      if(cont.length <= 5) return

      cont.splice(-1,1)[0].remove()
   }

   // auto resize
   function resizeArea(e){
      if(e.target.scrollHeight >= e.target.clientHeight){
         e.target.style.height = `${e.target.scrollHeight}px`
      }
   }

   async function submitArticle(e){
      e.preventDefault()

      const rest = [...e.target.elements].filter(x => x.className !== 'tag')
      rest.splice(5,1)

      const tags = [...e.target.elements].filter(x => x.classList.contains('tag'))

      const body = [...rest.map(x => x?.value), ...tags.map(x => x.value)]
      body[2] = rest[2].files[0]
      window.shortTitleRedirect = body[1]

      const load = new Loading(e.target.parentElement.children[0], false, 'loadgif')
      try{
         load.attach()

         const data = await fetchPost('/api/news', body, 'POST', false)
         if(data.success){
            const formdata = new FormData()
            formdata.append('artBack', body[2])
            const uplImage = await fetch(`/api/news/${body[1]}`, {
               method: 'POST',
               body: formdata
            })

            setRes({ success: uplImage.status === 200 ? true : false, msg: uplImage.statusText })
            if(uplImage.status !== 200){
               setTimeout(() => {
                  setRes(null)
               }, 3000);
            }

         }else{
            setRes({...data})
            setTimeout(() => {
               setRes(null)
            }, 3000);
         }     
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{ load.delete() }
   }

   return (
      <main className='write-news-cont'>
         <div className='wrap-write'>
            <section className='left-info-form-section'>
               <h1>Create a news article</h1>
               <h2>Make sure to verify your informations and keep it clean</h2>
               <h2>Also make sure to fill all fields</h2>
               <h3>Need help? <a href='/contact'>Contact us</a></h3>

               { res && res.success ? 
                  <h4 className={ res?.success.toString() }>
                     { res?.msg } <br/> 
                     Check it there: <span onClick={ () => window.location.href = `/news/${ window?.shortTitleRedirect }` }>{ window?.shortTitleRedirect }</span>
                  </h4> 
                  :
                  <h4 className={ res?.success.toString() }>{ res?.msg }</h4>          
               } 
            </section>
            <form onSubmit={ submitArticle }>           
               <div>
                  <label>TITLE</label>
                  <input type='text' />
               </div>

               <div>
                  <label>SHORT TITLE <span>(for search results, max 20 characters)</span></label>
                  <input className='sh' type='text' />
               </div>

               <div>
                  <label>TAGS <span>(minimum 3)</span></label>
                  <div className='tag-cont'>
                     <span onClick={ delTag }> <AiOutlineMinusCircle /> </span>
                     <span onClick={ addTag }> <AiOutlinePlusCircle /> </span>
             
                     <input spellCheck='false' className='tag' type='text' />
                     <input spellCheck='false' className='tag' type='text' />
                     <input spellCheck='false' className='tag' type='text' />
                  </div>
               </div>

               <div>
                  <label>Image thumbnail <span>(1080p+)</span></label>
                  <div className='select-image-cont'>
                     <input onChange={ displayImage } type='file' />
                     <figure>
                        <img className='def' src='https://www.doors.com.pl/images/joomlart/demo/default.jpg' alt='selected' />
                     </figure>
                  </div>
               </div>

               <div>
                  <label>Category</label>
                  <select>
                     <option></option>
                     <option>Politics</option>
                     <option>Discovery</option>
                     <option>Universe</option>
                     <option>Accidents</option>
                     <option>Achievements</option>
                     <option>Computer world</option>
                  </select>
               </div>
               
               <div className='text-art'>
                  <label>ACTUAL TEXT</label>
                  <div>
                     <textarea spellCheck='false' onKeyDown={ resizeArea }></textarea>
                     <section ref={ shortcutCont }>
                        <span>bH</span>
                        <span>sH</span>
                        <span>Link</span>
                     </section>
                  </div>
               </div>

               <Button text='Post' cname='n' />
            </form>
         </div>
      </main>
   )
};

export default WriteNews;
