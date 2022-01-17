import React from 'react'
import '../../css/Contact.css'
import { BsFillPersonBadgeFill, BsHeadset } from 'react-icons/bs'
import { ImLocation } from 'react-icons/im'
 
const Contact = () => {
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
            <p>Server administrator: <span>Norbert Gierczak</span></p>
            <p>CEO: <span>Damian Ziaja</span></p>
            <BsFillPersonBadgeFill />
         </div>

         <div className='divinf'>
            <p>Business mail: <span>fsdsoksf@gmail.com</span></p>
            <p>Support phone: <span>123987456</span></p>
            <BsHeadset />
         </div>

         <img src='https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' alt='office'></img>
      </main>
   )
}

export default Contact
