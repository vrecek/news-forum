import React from 'react'
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'
import { BiCommentDetail } from 'react-icons/bi'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { useRef, useEffect, useState } from 'react'
import { fetchPost } from '../../../js/fetches'

const TopicArticle = ({ pageNr, fav, wl, wdl, auth, id, title, text, data, authorname, authoravatar, likes, dislikes, comments, imageStrings, imageBin }) => {
   const textarticle = useRef()
   const [hasRated, setHasRated] = useState({ l: null, dl: null, f: null })
   const [rateA, setRateA] = useState(null)

   const [addFav, setAddFav] = useState(null)

   useEffect(() => {
      setHasRated({
         l: wl.some(x => x === auth.user.username).toString(),
         dl: wdl.some(x => x === auth.user.username).toString(),
         f: fav.some(x => x === auth.user.username).toString()
      })

      let modifiedText = ''
      modifiedText = text.replace(/\n/g, '</br>')

      const beg = modifiedText.match(/{-up}/ig) ?? []
      const end = modifiedText.match(/{up-}/ig) ?? []
      if( (beg.length === end.length) && imageStrings.length === imageBin.length ){
         for(let i=0; i<imageStrings?.length; i++){
            const img = `<img src='data:image/${imageBin[i].contentType};base64,${imageStrings[i]}' />`
            const sliced = modifiedText.slice( modifiedText.indexOf('{-up}'), modifiedText.indexOf('{up-}') + 5 )
            modifiedText = modifiedText.replace(sliced, img)
         }
      }
      
      textarticle.current.innerHTML = modifiedText
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

         const res = await fetchPost(`/api/forumgeneral/rate/like/${id}/${auth.user?.username}`, {}, 'PUT')
         setRateA(res.msg)
      }catch(err){
         setRateA(err.message)
      }finally{ setTimeout(() => setRateA(null), 2000) }
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
         const res = await fetchPost(`/api/forumgeneral/rate/dislike/${id}/${auth.user?.username}`, {}, 'PUT')
         setRateA(res.msg)
      }catch(err){
         setRateA(err.message)
      }finally{ setTimeout(() => setRateA(null), 2000) }
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
         const res = await fetchPost(`/api/forumgeneral/addFav/${id}/${auth.user?.username}`, {}, 'PUT')
         setAddFav(res.msg)

      }catch(err){
         setAddFav(err.message)

      }finally{ setTimeout(() => setAddFav(null), 2000) }
   }

   return (
      <article>
         <section className='user-info'>
            <figure>
               {
                  authoravatar.mime && authoravatar.convertedSrc ?
                  <img src={`data:image/${authoravatar.mime};base64,${authoravatar.convertedSrc}`} alt='avatar' />
                  :
                  <img src='https://iupac.org/wp-content/uploads/2018/05/default-avatar.png' alt='avatar' />
               }
            </figure>
            <div>
               <h4 onClick={ () => window.location.href=`/user/${authorname}` }>{ authorname }</h4>
               <h5>{ data }</h5>
            </div>
         </section>
               
         <section className='text-art'>
            <h2>{ title }</h2>
            <p ref={ textarticle }>
               
            </p>
         </section>
         
         <section className='icons-art'>
            <div className='in fia-l'>
               <span className={ hasRated.f && hasRated.f } onClick={ addToFav }><MdOutlineFavoriteBorder /></span>
               { addFav && <h3>{ addFav}</h3> }
            </div>

            <div className='in fia-c'>
               <span id='alike' className={ hasRated.l && hasRated.l } onClick={ likePost }> 
                  <AiOutlineLike /> 
                  <h6>{ likes }</h6> 
                  { rateA && <h3>{ rateA }</h3> }
               </span>
               <span id='adlike' className={ hasRated.dl && hasRated.dl } onClick={ dislikePost }> 
                  <AiOutlineDislike /> 
                  <h6>{ dislikes }</h6> 
               </span>
            </div>

            <div className='in fia-r'>
               <span onClick={ () => window.location.href=`/forum/main/${pageNr}/${id}` }> <BiCommentDetail /> <h6>{ comments.length }</h6> </span>
            </div>
         </section>
      </article>
   )
}

export default TopicArticle