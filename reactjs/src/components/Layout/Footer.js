import React from 'react'
import '../../css/Footer.css'
import { AiFillGithub } from 'react-icons/ai'
import { BsFacebook } from 'react-icons/bs'
import { FaSteam } from 'react-icons/fa'
 
const Footer = () => {
   return (
      <footer>
         <div className='icons'>
            <a per='Github' href='https://github.com/vrecek'> <AiFillGithub /> </a>        
            <a per='Facebook' href='/'> <BsFacebook /> </a>   
            <a per='Steam' href='/'> <FaSteam /> </a>   
         </div>

         <div className='uls'>
            <ul>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
            </ul>

            <ul>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
            </ul>

            <ul>
               <li><a href='/contact'>Contact</a></li>
               <li><a href='/about'>About</a></li>
               <li><a href='/'>Lorems</a></li>
               <li><a href='/'>Lorems</a></li>
            </ul>
         </div>

         <p className='fp'>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
         <ul className='outul'>
            <li><a href='/'>Perspiciatis</a></li>
            <li><a href='/'>Architecto</a></li>
            <li><a href='/'>Nostrum</a></li>
            <li><a href='/'>Pariatur</a></li>
         </ul>
         <p>&amp; All rights reserved to its owners &amp;</p>
         
      </footer>
   )
}

export default Footer
