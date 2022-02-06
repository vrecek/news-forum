import React from 'react'
import '../../css/Contact.css'
import { BsFillPersonBadgeFill, BsHeadset } from 'react-icons/bs'
import { ImLocation } from 'react-icons/im'
import { FaClipboard } from 'react-icons/fa'
 
const Contact = () => {
   async function copyToClip(e){
      const text = e.target.parentElement.children[0].textContent;
      await navigator.clipboard.writeText(text)
   }

   return (
      <main className='contact'>
         <h1>Contact:</h1>
         <div className='divinf'>
            <p>Company name: <span>Dolore inc.</span></p>
            <p>Country: <span>Poland</span></p>
            <p>City: <span>Loremipsum</span></p>
            <p>Street: <span>Sit amet 12</span></p>
            <ImLocation />
         </div>

         <div className='divinf'>
            <p>Webpage administrator: <span>John Doe</span></p>
            <p>Server administrator: <span>Mark Ipsum</span></p>
            <p>CEO: <span>Steven Dolore</span></p>
            <BsFillPersonBadgeFill />
         </div>

         <div className='divinf'>
            <p>Business mail: <span>dolorein@gmail.com</span> <span onClick={ copyToClip } className='copyclip'><FaClipboard /></span> </p>
            <p>Support phone: <span>123987456</span></p>
            <BsHeadset />
         </div>

         <img src='https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' alt='office'></img>
      </main>
   )
}

export default Contact
