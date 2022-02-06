import React from 'react';
import '../../css/ViewNews.css'
import '../../css/CommentsSection.css'
import { fetchGet } from '../../js/fetches'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'
import { BsCalendarDate } from 'react-icons/bs'
import { BiCategory } from 'react-icons/bi'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { FaUserAlt, FaLinkedinIn, FaFacebookF, FaGithubAlt, FaTwitter } from 'react-icons/fa'
import Comment from './Comment';

const ViewNews = () => {
   const [news,setNews] = useState(null)
   const textCont = useRef(0)
   const navigate = useNavigate()

   const url = window.location
   const id = url.pathname.replace(/\/news\//, '')

   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         try{
            load.attach()

            let data = await fetchGet(`/api/news/get-one/${ id }`)  

            // short text under title
            let shortText = data.text.slice(0, 300).split(' ')
            shortText.splice(-1, 1)
            shortText = shortText.join(' ').concat('...') 
            shortText = shortText.replace(/{-bh}|{bh-}|{-sh}|{sh-}/g, '')      
            Object.assign(data, { shrt: shortText })

            // read in x - time
            // 6 per sec
            const words = data.text.split(' ')
            const minutes = Math.ceil(words.length / 6 / 60)
            Object.assign(data, { min: minutes })

            // BIG HEADER
            data.text = data.text.replace(/{-bh}/g, '<h1>')
            data.text = data.text.replace(/{bh-}/g, '</h1>')

            // SMALL BLUE HEADER
            data.text = data.text.replace(/{-sh}/g, '<h2>')
            data.text = data.text.replace(/{sh-}/g, '</h2>')

            // ENTER NEW LINE
            data.text = data.text.replace(/\n/g, '<br/>')

            // 'a' LINK TAG
            // <a target='_blank' href='https://www.google.com'>

            setNews(data)
            textCont.current.innerHTML = data.text

            const enc = data.shortTitle.replace(/ /g, '-').toLowerCase();
            window.history.pushState('news', '', enc)

         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete() }
      })()
   }, [])

   if(news)
   return (
      <article className='newsArticle'>
         <div 
         style={{ background: `url(data:image/${ news.image.contentType };base64,${ news.image.data })`, backgroundSize: 'cover' }} className='main-img'
         >
            <section>
               <div className='miscinf'>
                  <figure>
                     {
                        news && news.author?.avatar ?
                           <img src={`data:image/${ news.author.avatar.contentType };base64,${ news.author.avatar.source }`} alt='avatar_error' />
                        :
                           <img src='https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' alt='avatar_error' />
                     }    
                  </figure>
                  <figcaption>{ news.author.firstname } <span>''{ news.author.nickname }''</span> { news.author.lastname }</figcaption>
                  <span onClick={ () => window.location.href = `/user/${news.author.nickname}`} className='iconuser'><FaUserAlt /></span>
               </div>

               <div className='datecat'>
                  <h2 className='categoryh'><BiCategory /> { news.category }</h2>
                  <h2><BsCalendarDate /> { news.data }</h2>
               </div>

               <div className='textinf'>
                  <h1>{ news.title }</h1>
                  <p>{ news.shrt }</p>
               </div>

               <h2 className='readtime'> <AiOutlineClockCircle /> Read this in { news.min } minute(s)</h2>
            </section>
         </div>

         <article className='main-content'>
            <div className='icons'>
               <span per='Facebook'> <p>FB</p> <FaFacebookF/></span>
               <span per='LinkedIn'> <p>IN</p> <FaLinkedinIn /></span>
               <span per='Github'> <p>GTH</p><FaGithubAlt /></span>
               <span per='Twitter'> <p>TWT</p> <FaTwitter /></span>
            </div>

            {/* ACTUAL ARTICLE CONTENT -- INNER HTML */}
            <section ref={ textCont } className='textarticle'>
            
            </section>

            <section className='finaltext'>
               <h3>See more:</h3>
               <p> <a href='/'>Long text title lorem ipsum new</a> </p>
               <p> <a href='/'>Long text title lorem ipsum new</a> </p>
               <p> <a href='/'>Long text title lorem ipsum new</a> </p>
               <p> <a href='/'>Long text title lorem ipsum new</a> </p>

               <div className='authimage'>
                  <figure>
                     {
                        news && news.author?.avatar ?
                           <img src={`data:image/${ news.author.avatar.contentType };base64,${ news.author.avatar.source }`} alt='avatar_error' />
                        :
                           <img src='https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' alt='avatar_error' />
                     }                                  
                  </figure>
                  <h4>
                     <span>Test hujeTest hujeowTest hujeowTest hujeowTest hujeowTest hujeowTest hujeowTest hujeowow</span>
                  </h4> 
               </div>
               
               <div className='links'>
                  <ul>
                     <li>Related topics</li>
                     <li> <a href='/'>dassad</a> </li>
                     <li> <a href='/'>dassad</a> </li>
                     <li> <a href='/'>dassad</a> </li>
                     <li> <a href='/'>dassad</a> </li>
                  </ul>

                  <ul>
                     <li>Other in category</li>
                     <li> <a href='/'>dassad</a> </li>
                     <li> <a href='/'>dassad</a> </li>
                     <li> <a href='/'>dassad</a> </li>
                     <li> <a href='/'>dassad</a> </li>
                  </ul>
               </div>
            </section>
         </article>

         <section className='comments'>
            <h3 className='comments-str'>Comments</h3>
            <section className='com-cont'>           
               <Comment />
               <Comment />
               <Comment />
            </section>
         </section>
      </article>
   )

   else
   return (
      <p>loading</p>
   )
};

export default ViewNews;
