import React from 'react'
import '../../css/About.css'
import { SiWebmoney } from 'react-icons/si'
import { MdEmojiPeople } from 'react-icons/md'
import { useRef, useEffect } from 'react'

const About = () => {
   let item = useRef(null)
   let sec_one = useRef(null)
   let sec_two = useRef(null)

   useEffect(() => {
      item = item.current.firstChild
      sec_one = sec_one.current
      sec_two = sec_two.current
      window.addEventListener('load', eventHandle)
      window.addEventListener('scroll', eventHandle)

      window.addEventListener('scroll', eventHandle2)

      window.addEventListener('scroll', eventHandle3)
   }, [item, sec_one, sec_two])

   function removeEvents(func, loadev = false){
      window.removeEventListener('scroll', func)
      if(loadev) window.removeEventListener('load', func)
   }

   function eventHandle(){
      const rect = item.getBoundingClientRect()
      if (
         rect.top >= 0 &&
         rect.left >= 0 &&
         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      ){
         item.className = 'animated animatedp'; 

         removeEvents(eventHandle, true)
      }
   }

   //

   function eventHandle2(){
      const rect2 = sec_one.getBoundingClientRect()
      if (
         rect2.top >= 0 &&
         rect2.left >= 0 &&
         rect2.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect2.right <= (window.innerWidth || document.documentElement.clientWidth)
      ){
         sec_one.className = 'sectext1'; 

         removeEvents(eventHandle2)
      }
   }

   //

   function eventHandle3(){
      const rect3 = sec_two.getBoundingClientRect()
      if (
         rect3.top >= 0 &&
         rect3.left >= 0 &&
         rect3.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect3.right <= (window.innerWidth || document.documentElement.clientWidth)
      ){
         sec_two.className = 'sectext2'; 

         removeEvents(eventHandle3)
      }
   }

   return (
      <main className='about'>
         <h1>About us:</h1>
         
         <h2>Who are we ?</h2>
         <p className='centtext'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

         <h2>What do we offer ?</h2>
         <p className='centtext'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis <span className='reds'>nostrud exercitation</span> ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <span className='reds'>Excepteur sint occaecat</span> cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

         <div ref={ item }>
            <p className='animatedp'>Lorem ipsum dolor sit amet conqestaur liberum</p>
         </div>
         
         <article>
            <section ref={ sec_one }>
               <h3> <SiWebmoney /> Fresh web news <SiWebmoney /> </h3>
               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, <span className='reds'>sed do eiusmod tempor incididunt</span> ut labore et dolore magna aliqua. Ut enim ad minim veniam, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </section>

            <section className='imgcont'>
               <img src='https://images.hdqwalls.com/download/internet-technology-hg-1920x1080.jpg' alt='web' />
            </section>
         </article>

         <article>
            <section className='imgcont'>
               <img src='https://c1.wallpaperflare.com/preview/729/854/534/community-dark-full-moon-luna.jpg' alt='web' />
            </section>

            <section ref={ sec_two }>
               <h3> <MdEmojiPeople /> Active community <MdEmojiPeople /> </h3>
               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <span className='reds'>Duis aute irure dolor</span> in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </section>
         </article>

         <h1 className='lasth'>Thanks for visiting traveler!</h1>
      </main>
   )
}

export default About
