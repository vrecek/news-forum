import React from 'react'
import '../../css/SliderCont.css'
import img1 from '../../images/slide1.png'
import img2 from '../../images/slide2.png'
import img3 from '../../images/slide3.png'
import img4 from '../../images/slide4.png'
import test from '../../images/test.png'
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi'
import { useRef, useEffect } from 'react'
import Button from '../Reusable/Button'

const SliderCont = () => {
   let len = null;
   let finished = true;
   let counter = 1;
   function changeSlide(e, direction){
      if(!finished) return;
      finished = false;

      const cont = e.target.parentElement.childNodes[1].childNodes[0]
      len = cont.childNodes.length

      direction === 'left' ? counter-- : counter++
      dref.current.style.transition = 'all 1s'
 
      cont.style.transform = `translateX(-${100 * counter}%)`
   }

   const dref = useRef(0)
   useEffect(() => { 
      dref.current.style.transform = 'translateX(-100%)'
      dref.current.addEventListener('transitionend', () => {
         finished = true;
         if(counter === len - 1){
            dref.current.style.transition = '0s'
            counter = 1
            dref.current.style.transform = 'translateX(-100%)'
         }else if(counter === 0){
            dref.current.style.transition = '0s'
            counter = len - 2
            dref.current.style.transform = `translateX(-${100 * counter}%)`
         }
      })
   })

   return (
      <section className='slidercont'>
         <h2 className='hed'>Explore new things</h2>
         <p className='para'>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>

         <section className='inner-cont'>
            <figure>
               <Button action={ (e)=>changeSlide(e, 'left') } text={ <BiLeftArrow /> } cname='n' />
               <div className='outdiv'> 
                  <div ref={ dref }>        
                     <img src={ img4 } alt='text' />
                     <img src={ img1 } alt='text' />
                     <img src={ img2 } alt='text' />
                     <img src={ img3 } alt='text' />
                     <img src={ img4 } alt='text' />
                     <img src={ img1 } alt='text' />
                  </div> 
               </div>        
               <Button action={ (e)=>changeSlide(e, 'right') } text={ <BiRightArrow /> } cname='n' />
            </figure>

            <article>
               <figure>
                  <img src={ test } alt='test' />
               </figure>
               <h3>Lorem ipsum ?</h3>
               <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
               <Button text='Continue reading' cname='n' />
            </article>      
         </section>
      </section>
   )
}

export default SliderCont
