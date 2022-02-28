import React from 'react';
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import { fetchPost } from '../../js/fetches';
import SignInToComment from './SignInToComment';
import { useState } from 'react';

const Comment = ({ whoLiked,whoDisliked, whoRead, newsId, id, av_mime, av_src, authorName, data, text, likes, dislikes }) => {
   const [dmr, hm] = [data.slice(0, data.indexOf('-') - 1), data.slice(data.indexOf('-') + 2)]
   const [sign, setSign] = useState(null)
   const hasLiked = whoLiked.some(x => x === whoRead)
   const hasDisliked = whoDisliked.some(x => x === whoRead)

   const likef = async e => {
      if(!whoRead){
         setSign(true)
         return
      }

      const h2 = e.target.children[1]     
      h2.textContent = parseInt(h2.textContent) + 1

      const dislike = e.target.parentElement.children[1]
      if(dislike.classList.contains('truer')){
         const num = dislike.children[1]
         dislike.className = ''
         num.textContent = parseInt(num.textContent - 1)
      }

      e.target.className = 'trueg'
      
      await fetchPost(`/api/news/put-comment/like/${newsId}/${id}/${whoRead}`, {}, 'PUT')
   }

   const dislikef = async e => {
      if(!whoRead){
         setSign(true)
         return
      }

      const h2 = e.target.children[1]
      h2.textContent = parseInt(h2.textContent) + 1

      const like = e.target.parentElement.children[0]
      if(like.classList.contains('trueg')){
         const num = like.children[1]
         like.className = ''
         num.textContent = parseInt(num.textContent - 1)
      }

      e.target.className = 'truer'
      
      await fetchPost(`/api/news/put-comment/dislike/${newsId}/${id}/${whoRead}`, {}, 'PUT')
   }

   return (
      <article>
         { sign && <SignInToComment close={ () => setSign(null) } /> }

         <section className='com-infos'>
            <figure>
               <img src={`data:image/${av_mime};base64,${av_src}`} alt='avatar' />
            </figure>
            <figcaption onClick={()=>window.location.href=`/user/${authorName}`}> { authorName } </figcaption>

            <h5>Commented: <span>{dmr}</span><span>{hm}</span></h5>
         </section>

         <section className='com-text'>
            <p>{ text }</p>
                     
            <div className='rating-cont'>
               <div className={ hasLiked ? 'trueg' : '' } onClick={ likef }>
                  <AiFillLike />
                  <h6>{ likes }</h6>
               </div>

               <div className={ hasDisliked ? 'truer' : '' } onClick={ dislikef }>
                  <AiFillDislike />
                  <h6>{ dislikes }</h6>
               </div>
            </div>
         </section>
      </article>
   ) 
};

export default Comment;
