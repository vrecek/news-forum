import React from 'react';
import '../../css/ViewNews.css'
import '../../css/CommentsSection.css'
import '../../css/WriteComment.css'
import { fetchGet, fetchPost } from '../../js/fetches'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'
import { BsCalendarDate } from 'react-icons/bs'
import { BiCategory } from 'react-icons/bi'
import { AiOutlineClockCircle, AiOutlineLike, AiOutlineDislike, AiOutlineComment } from 'react-icons/ai'
import { FaUserAlt, FaLinkedinIn, FaFacebookF, FaGithubAlt, FaTwitter, FaCommentAlt } from 'react-icons/fa'
import Comment from './Comment';
import Button from '../Reusable/Button'
import SignInToComment from './SignInToComment';

const ViewNews = () => {
   const [news,setNews] = useState(null)
   const [auth, setAuth] = useState(null)
   const [posted, setPosted] = useState(null)
   const [hasRated, setHasRated] = useState(null)
   const [showNotlogged, setShowNotlogged] = useState(null)

   const comms = useRef()
   const textCont = useRef(0)
   const navigate = useNavigate()

   const url = window.location
   const id = url.pathname.replace(/\/news\//, '')

   const submitComment = async e => {
      e.preventDefault()

      let data = null
      const area = e.target.elements[0].value   
      const load = new Loading(e.target, false, 'loadgif')
      load.attach()

      try{
         data = await fetchPost('/api/news/post-comment', [area, news._id])
         setPosted(data)
      }catch(err){
         setPosted({ success: false, msg: err.message })
      }finally{
         load.delete()    
         setTimeout(() => { setPosted(null) }, 3000)     
      }
      
   }

   const rateLike = async e => {
      if(!auth.result || !auth.user){
         setShowNotlogged(true)
         return

      }else{
         e.target.className = 'trueg'
         if(e.target.parentElement.children[1].classList.contains('truer')){
            const num = e.target.parentElement.children[1].children[1]
   
            e.target.parentElement.children[1].className = ''
            num.textContent = parseInt(num.textContent) - 1
         }
         e.target.children[1].textContent = parseInt(e.target.children[1].textContent) + 1
   
         await fetchPost(`/api/news/put-news/like/${news._id}/${auth.user.username}`, {}, 'PUT')
      }  
   }

   const rateDislike = async e => {
      if(!auth.result || !auth.user){
         setShowNotlogged(true)
         return
         
      }else{
         e.target.className = 'truer'
         if(e.target.parentElement.children[0].classList.contains('trueg')){
            const num = e.target.parentElement.children[0].children[1]
   
            e.target.parentElement.children[0].className = ''
            num.textContent = parseInt(num.textContent) - 1
         }
         e.target.children[1].textContent = parseInt(e.target.children[1].textContent) + 1
   
         await fetchPost(`/api/news/put-news/dislike/${news._id}/${auth.user.username}`, {}, 'PUT')
      }   
   }

   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         try{
            load.attach()

            let data = await fetchGet(`/api/news/get-one/${ id }`)  
            const isAuth = await fetchGet(`/api/users/is-authed`)
            setAuth(isAuth)

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

            // a LINK TAG
            const count = (data.text.match(/:}/g) || [])
            for(let x=0; x<count.length; x++){
               const first = data.text.match('{-l:').index
               const last = data.text.match(':}').index

               const href = data.text.slice(first + 4, last)         
               const href2 = href.replace(/\//g, '\\/').replace(/\?/g, '\\?').replace(/\./g, '\\.')

               const reg = new RegExp(href2, 'gi')
               data.text = data.text.replace(reg, '')
               data.text = data.text.replace(':}', '').replace('{l-}', '</a>')
               data.text = data.text.replace('{-l:', `<a target='_blank' href="${href}">`)
               
            }

            // BIG HEADER
            data.text = data.text.replace(/{-bh}/g, '<h1>')
            data.text = data.text.replace(/{bh-}/g, '</h1>')

            // SMALL BLUE HEADER
            data.text = data.text.replace(/{-sh}/g, '<h2>')
            data.text = data.text.replace(/{sh-}/g, '</h2>')

            // ENTER NEW LINE
            data.text = data.text.replace(/\n/g, '<br/>')

            setNews(data)
            textCont.current.innerHTML = data.text
            
            const liked = data.whoLiked.some(x => x === isAuth.user?.username)
            const disliked = data.whoDisliked.some(x => x === isAuth.user?.username)
            setHasRated({ liked, disliked })

            const enc = data.shortTitle.replace(/ /g, '-').toLowerCase();
            window.history.pushState('news', '', enc)

         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete() }
      })()
   }, [id, navigate])

   if(news)
   return (
      <article className='newsArticle'>
         { showNotlogged && <SignInToComment close={ () => setShowNotlogged(null) } /> }

         <div 
         style={{ background: `url(data:image/${ news.image.contentType };base64,${ news.image.data })`, backgroundSize: 'cover', backgroundPosition: '50% 50%' }} className='main-img'
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

               <div className='tags'>
                  {
                     news?.tags.map((x,i) => (
                        <span key={i}>#{x}</span>
                     ))
                  }
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

            <div className='left-icons'>
               <div>
                  <span className={ hasRated?.liked ? 'trueg' : '' } onClick={ rateLike }> <AiOutlineLike /> 
                     <h5>{ news && news.likes }</h5> 
                  </span>
                  <span className={ hasRated?.disliked ? 'truer' : '' } onClick={ rateDislike }> <AiOutlineDislike /> 
                     <h5>{ news && news.dislikes }</h5> 
                  </span>
                  <span onClick={ ()=>comms?.current.scrollIntoView() }> <AiOutlineComment />  { news && news.comments.length } </span>
               </div>
            </div>

            <section className='finaltext'>
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

               <h3>See more from { news?.author.nickname }:</h3>
               {
                  news?.fromAuthor.map((x,i) => (
                     <p key={i} onClick={()=>window.location.href=`/news/${x._id}`}>{x.shortTitle}</p>
                  ))
               }
               
               <div className='links'>
                  <ul>
                     <li className='li-h'>Related topics</li>
                     <li> dassad </li>
                     <li> dassad </li>
                     <li> dassad </li>
                     <li> dassad </li>
                  </ul>

                  <ul>
                     <li className='li-h'>Other in category</li>
                     {
                        news && news?.fromCategory.map((x,i) => (
                           <li onClick={()=>window.location.href=`/news/${x._id}`} key={i}> { x.shortTitle } </li>
                        ))
                     }
                  </ul>
               </div>
            </section>
         </article>

         <section ref={ comms } className='comments'>
            <h3 className='comments-str'>Discussion ({ news && news.comments.length })</h3>
            <section className='com-cont'>        
               {
                  news && auth && 
                  news.comments.length 
                  ?
                  news.comments.map((x,i) => (
                     <Comment
                        key={i}
                        text={x.text}
                        authorName={x.author.name}
                        av_mime={x.author.avatar.mime}
                        av_src={x.author.avatar.src}
                        likes={x.likes}
                        dislikes={x.dislikes}
                        data={x.dateTime}
                        id={x._id}
                        newsId={news._id}
                        whoRead={auth?.user?.username}
                        whoLiked={x.whoLiked}
                        whoDisliked={x.whoDisliked}
                     />
                  ))
                  :
                  <h2 className='no-com'>There are no comments yet</h2>
               }
            </section>

            <form onSubmit={ submitComment } className='write-com-cont'>
               {
                  posted && <h3 className={ posted.success.toString() }>{ posted.msg }</h3>
               }

               {
                  !auth.result && <h2>Log in to comment</h2>
               }
               <h4><FaCommentAlt /> Share your opinion</h4>
               <section>
                  <figure>
                     <div>
                        {
                           auth.result ? 
                              <img src={`data:image/${auth.user.avatar.contentType};base64,${ auth.user.avatarString }`} alt='avatar' />
                           :
                              <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' alt='no-avatar' />
                        } 
                     </div>
                     <figcaption>
                        {
                           auth.result ? auth.user.username : 'Not logged'
                        }
                     </figcaption>            
                  </figure>
                  <textarea spellCheck='false'></textarea>
               </section>
               { auth.result && <Button text='Comment' cname='n' /> }
            </form>

         </section>
      </article>
   )

   else
   return (
      <p>loading</p>
   )
};

export default ViewNews;
