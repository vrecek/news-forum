import React from 'react'
import { AiOutlineLike, AiFillEdit } from 'react-icons/ai'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { BsFillTrashFill } from 'react-icons/bs'
import { fetchPost } from '../../../js/fetches'

const MainComm = ({ whoLiked, postId, commId, text, authorName, authorMime, authorSrc, date, likes, currentUser, ajaxDel }) => {
   const hasLiked = whoLiked.includes(currentUser).toString()

   const showCommMenu = e => {
      const ul = e.target.parentElement.children[1]

      if(!ul.style.display || ul.style.display === 'none'){
         ul.style.display = 'block'
         setTimeout(() => ul.style.height = '32px', 50)

      }else{
         ul.style.height = '1px'
         setTimeout(() => ul.style.display = 'none', 500)
      }
   }

   const deleteComment = async e => {
      const sect = e.target.parentElement.parentElement.parentElement

      const div = document.createElement('div')
      div.appendChild(document.createTextNode('Processing...'))
      div.className = 'comm-del-proc'
      sect.appendChild(div)

      try{
         await fetchPost('/api/forumgeneral/del-comm', { commId, postId, currentUser, authorName }, 'DELETE')
         div.remove()
         ajaxDel(commId)

      }catch(err){
         div.remove()

         const div2 = document.createElement('div')
         div2.appendChild(document.createTextNode(`Error! ${err.message}`))
         div2.className = 'comm-del-proc'
         sect.appendChild(div2)
         setTimeout(() => {
            div2.remove()
         }, 2000);
      }
   }

   const likeComment = async e => {
      const likes = e.target.parentElement.children[1]

      e.target.parentElement.classList.toggle('true')
      if(whoLiked.includes(currentUser)){
         likes.textContent = parseInt(likes.textContent) - 1     
         whoLiked.splice(whoLiked.indexOf('vrecek'), 1)

      }else{
         likes.textContent = parseInt(likes.textContent) + 1
         whoLiked.push(currentUser)
      }

      try{
         const res = await fetchPost('/api/forumgeneral/like-comm', { whoLiked, currentUser, postId, commId }, 'PUT')
         console.log(res)
      }catch(err){
         console.log(err)
      }
      
   }

   return (
      <article className='main-art-comm'>
         <div>
            <figure>
               {
                  authorMime && authorSrc ?
                  <img src={`data:image/${authorMime};base64,${authorSrc}`} />
                  :
                  <img src='https://iupac.org/wp-content/uploads/2018/05/default-avatar.png' alt='avatar' />
               }
            </figure>

            <span>
               <h4 onClick={ () => window.location.href=`/user/${authorName}` }>{ authorName }</h4>
               <h5>{ date }</h5>
            </span>
         </div>
         <section>
            { text }

            {
               currentUser === authorName && 
               <div className='comm-dots'>
                  <span onClick={ showCommMenu } className='dots'> <BiDotsHorizontalRounded /> </span>
                  <ul>
                     <li onClick={ deleteComment }> <BsFillTrashFill /> Delete comment</li>
                  </ul>
               </div>
            }

            <span className={ hasLiked } id='comm-like'> <i onClick={ likeComment }><AiOutlineLike /> </i> <span>{ likes }</span> </span>
         </section>
      </article>
   )
}

export default MainComm