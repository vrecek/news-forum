import React from 'react';
import { AiFillLike, AiFillDislike, AiOutlineFieldTime } from 'react-icons/ai'

const Comment = ({ avatar, authorName, data, text, likes, dislikes }) => {
   return (
      <article>
         <section className='com-infos'>
            <figure>
               <img src='https://media.istockphoto.com/photos/portrait-of-a-man-picture-id155360935' alt='avatar' />
            </figure>
            <figcaption> <a href='/'>vrecek</a> </figcaption>

            <h5>Commented: <span>18:46</span> <span>19.02.2022</span></h5>
         </section>

         <section className='com-text'>
            <p>kodskafokafdokafdsoakfoakfdkodskafokafdokafdsoakfoakfdkodskafokafdokafdsoakfoakfdkodskafokafdokafdsoakfoakfdkodskafokafdokafd</p>
                     
            <div className='rating-cont'>
               <div>
                  <AiFillLike />
                  <h6>624</h6>
               </div>

               <div>
                  <AiFillDislike />
                  <h6>62</h6>
               </div>
            </div>
         </section>
      </article>
   ) 
};

export default Comment;
