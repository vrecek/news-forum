import React from 'react'
import '../../../css/MainPost.css'
import '../../../css/MainComm.css'
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { useState, useEffect, useRef } from 'react'
import { fetchGet, fetchPost } from '../../../js/fetches' 
import { useNavigate } from 'react-router-dom'
import MainComm from './MainComm'
import MainWriteComm from './MainWriteComm'

const MainPost = () => {
   const [post, setPost] = useState(null)
   const [auth, setAuth] = useState(null)
   const [rated, setRated] = useState(null)

   const [fr, setFr] = useState(null)
   const [rr, setRr] = useState(null)

   const [commPost, setCommPost] = useState(null)

   const navigate = useNavigate()
   const tcont = useRef()
   const nocom = useRef()

   useEffect(() => {
      (async function init(){
         const id = window.location.href.slice(window.location.href.lastIndexOf('/') + 1)
         
         try{
            let art = await fetchGet(`/api/forumgeneral/post/${id}`)
            const authed = await fetchGet('/api/users/is-authed')

            art = art.reduce((p, c) => p + c)
            art.comments.reverse()
            setAuth(authed)
            setPost(art)
            setRated({
               f: art.whosFav.includes(authed.user?.username),
               l: art.whoLiked.includes(authed.user?.username),
               dl: art.whoDisliked.includes(authed.user?.username)
            })

            let modifiedText = ''
            modifiedText = art.text.replace(/\n/g, '</br>')
            const beg = modifiedText.match(/{-up}/ig) ?? []
            const end = modifiedText.match(/{up-}/ig) ?? []
            if( (beg.length === end.length) && art.uploadedImagesString.length === art.uploadedImages.length ){
               for(let i=0; i<art.uploadedImagesString?.length; i++){
                  const img = `<img src='data:image/${art.uploadedImages[i].contentType};base64,${art.uploadedImagesString[i]}' />`
                  const sliced = modifiedText.slice( modifiedText.indexOf('{-up}'), modifiedText.indexOf('{up-}') + 5 )
                  modifiedText = modifiedText.replace(sliced, img)
               }
            }
            tcont.current.innerHTML = modifiedText

         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }     
      })()
   }, [])

   const likePost = async e => {
      try{
         const t = e.target
         const tp = t.parentElement.children[1]

         if(tp.classList.contains('true')){
            tp.children[1].textContent = parseInt(tp.children[1].textContent) - 1
         }
         tp.className = ''

         t.className = 'true'
         t.children[1].textContent = parseInt(t.textContent) + 1

         const res = await fetchPost(`/api/forumgeneral/rate/like/${post._id}/${auth.user?.username}`, {}, 'PUT')
         setRr(res.msg)

      }catch(err){
         setRr(err.message)
      }finally{ setTimeout(() => setRr(null), 2000) }
   }

   const dislikePost = async e => {
      try{
         const t = e.target
         const tp = t.parentElement.children[0]

         if(tp.classList.contains('true')){
            tp.children[1].textContent = parseInt(tp.children[1].textContent) - 1
         }
         tp.className = ''
         
         t.className = 'true'
         t.children[1].textContent = parseInt(t.textContent) + 1
         const res = await fetchPost(`/api/forumgeneral/rate/dislike/${post._id}/${auth.user?.username}`, {}, 'PUT')
         setRr(res.msg)

      }catch(err){
         setRr(err.message)
      }finally{ setTimeout(() => setRr(null), 2000) }
   }

   const addToFav = async e => {
      try{
         const x = e.clientX - 10
         const y = e.clientY - 10
         const span = document.createElement('span')
         span.className = 'click'
         document.body.appendChild(span)
         span.style.top = `${y}px`
         span.style.left = `${x}px`
         setTimeout(() => {
            span.remove()
         }, 500);

         e.target.classList.toggle('true')
         const res = await fetchPost(`/api/forumgeneral/addFav/${post._id}/${auth.user?.username}`, {}, 'PUT')
         setFr(res.msg)

      }catch(err){
         setFr(err.message)

      }finally{ setTimeout(() => setFr(null), 2000) }
   }

   const ajaxComment = (nick, text, mime, src) => {
      const d = new Date(Date.now()).toLocaleString()
      const data = `${d.slice(0, d.indexOf(','))} - ${d.slice(d.indexOf(',') + 2, d.lastIndexOf(':'))}`
      if(nocom?.current){
         nocom.current.style.display = 'none'
      }
      setCommPost({ text: text, nick: nick, mime: mime, src: src, data: data })
   }

   const ajaxDeleteComment = commentId => {
      const p = {...post}
      p.comments = p.comments.filter(x => x._id !== commentId)

      setPost(p)
   }

   if(!post) return ( <main className='main-post'></main> )
   else
   return (
      <main className='main-post'>
         <article className='mp-wrap'>

            <section className='post'>
               <section className='user-info'>
                  <figure>
                     {
                        post.postAuthor.avatar.convertedSrc ? 
                        <img src={`data:image/${post.postAuthor.avatar.mime};base64,${post.postAuthor.avatar.convertedSrc}`} alt='avatar' />
                        :
                        <img src='https://iupac.org/wp-content/uploads/2018/05/default-avatar.png' alt='avatar' />
                     }
                  </figure>
                  <div>
                     <h2 onClick={ () => window.location.href=`/user/${post.postAuthor.name}` }>{ post.postAuthor.name }</h2>
                     <h3>Posted: <span>{ post.postData }</span></h3>
                     <h1>{ post.title }</h1>
                  </div>
               </section>

               <section className='post-text'>
                  <span ref={ tcont }>

                  </span>
               </section>
               
               <section className='post-icons'>
                  <span onClick={ addToFav } id='p-fav' className={ rated?.f.toString() }><MdOutlineFavoriteBorder /></span>
                  { fr && <h5 className='fr'>{ fr }</h5> }

                  <div>
                     <span onClick={ likePost } className={ rated?.l.toString() }><AiOutlineLike /> <h4>{ post.likes }</h4></span>
                     { rr && <h5 className='rr'>{ rr }</h5> }
                     <span onClick={ dislikePost } className={ rated?.dl.toString() }><AiOutlineDislike /> <h4>{ post.dislikes }</h4></span>
                  </div>
                  <span><BiCommentDetail /> { post.comments.length }</span>
               </section>

               <section className='post-comms'>
                  <MainWriteComm id={ post._id } user={ auth } ajax={ ajaxComment } /> 

                  { 
                     commPost && 
                     <MainComm 
                        text={ commPost.text } 
                        authorName={ commPost.nick }
                        authorMime={ commPost.mime }
                        authorSrc={ commPost.src }
                        date={ commPost.data }
                        likes='0' 
                     /> 
                  }

                  {
                     post.comments.length ? 
                     post.comments.map(x => (
                        <MainComm 
                           commId={x._id}
                           postId={post._id}
                           key={x._id} 
                           authorName={x.author.name}  
                           authorMime={x.author.avatar.mime}
                           authorSrc={x.author.avatar.convertedSrc}
                           currentUser={auth?.user.username}
                           text={x.text}
                           likes={x.likes}
                           whoLiked={x.whoLiked}
                           date={x.convertedDateTime}
                           ajaxDel={ajaxDeleteComment}
                        />
                     ))
                     :
                     <h1 ref={ nocom }>No comments yet</h1>
                  }
               </section>
            </section>

         </article>
      </main>
   )
}

export default MainPost