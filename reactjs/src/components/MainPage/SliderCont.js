import React from 'react'
import '../../css/SliderCont.css'
import img1 from '../../images/slide1.png'
import img2 from '../../images/slide2.png'
import img3 from '../../images/slide3.png'
import img4 from '../../images/slide4.png'
import { BiRightArrow, BiLeftArrow } from 'react-icons/bi'
import { useRef, useEffect } from 'react'
import Button from '../Reusable/Button'
import SliderText from './SliderText'

const SliderCont = () => {
   let len = null;
   let finished = true;
   let counter = 1, counter2 = 1;
   function changeSlide(e, direction){
      if(!finished || e.target.classList.contains('text')) return;
      finished = false;

      const cont = e.target.parentElement.childNodes[1].childNodes[0]
      const textcont = e.target.parentElement.parentElement.children[1].children[0];
      
      len = cont.childNodes.length

      direction === 'left' ? counter-- : counter++
      direction === 'left' ? counter2-- : counter2++
      dref.current.style.transition = 'all 1s'
      tref.current.style.transition = 'all 1s'
 
      cont.style.transform = `translateX(-${100 * counter}%)`
      textcont.style.transform = `translateX(-${100 * counter}%)`
   }

   const dref = useRef(0)
   const tref = useRef(0)
   useEffect(() => { 
      dref.current.style.transform = 'translateX(-100%)'
      tref.current.style.transform = 'translateX(-100%)'

      tref.current.addEventListener('transitionend', () => {
         if(counter2 === len - 1){
            tref.current.style.transition = '0s'
            counter2 = 1
            tref.current.style.transform = 'translateX(-100%)'
         }else if(counter2 === 0){
            tref.current.style.transition = '0s'
            counter2 = len - 2
            tref.current.style.transform = `translateX(-${100 * counter}%)`
         }
      })

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
   }, [])

   return (
      <section className='slidercont'>
         <h2 className='hed'>Explore new things</h2>
         <p className='para'>Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>

         <section className='inner-cont'>
            <figure className='plfig'>
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
               <section ref={ tref }>
                  <SliderText src='https://images.unsplash.com/photo-1548391350-968f58dedaed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' title='Deserunt mollitia animi' />
                  <SliderText src='https://images.unsplash.com/photo-1501510691679-728450bdcb40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80' title='Maiores alias' />
                  <SliderText src='https://images.unsplash.com/photo-1573588028698-f4759befb09a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80' title='Perferendis doloribus' />
                  <SliderText src='https://images.unsplash.com/photo-1510145505901-0b91789b30bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80' title='Itaque earum rerum' />
                  <SliderText src='https://images.unsplash.com/photo-1548391350-968f58dedaed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' title='Deserunt mollitia animi' />
                  <SliderText title='Maiores alias' />
               </section>
            </article>      
         </section>
      </section>
   )
}

export default SliderCont
