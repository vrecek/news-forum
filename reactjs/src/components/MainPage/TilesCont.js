import React from 'react'
import '../../css/TilesCont.css'
import t1 from '../../images/tile1.png'
import t2 from '../../images/tile2.png'
import t3 from '../../images/tile3.png'
import t4 from '../../images/tile4.png'
import t5 from '../../images/tile5.png'
import t6 from '../../images/tile6.png'
import Tile from './Tile'
import { useRef, useEffect } from 'react'

const TilesCont = () => {
   const refere = useRef(null);
   let scroll = null;
   let item = null;
   useEffect(() => {
      scroll = refere.current.offsetTop - refere.current.offsetHeight;
      item = refere.current.childNodes[0].childNodes[1];
      window.addEventListener('scroll', eventHandle)
   }, [])

   function eventHandle(){
      if(window.scrollY >= scroll) {
         item.className = 'animated'; 
         setTimeout(() => {
            item.style.border = '0';
         }, 3000);
         removeEvent();
      }
   }
   function removeEvent(){ window.removeEventListener('scroll', eventHandle) }
   
   return (
      <section ref={ refere } className='tilescont'>
         <h1>Category topics <span>Category topics</span> </h1>
         
         <section>
            <Tile text='Worldwide' src={ t1 }/>
            <Tile text='Local area' src={ t3 }/>
            <Tile text='Universe' src={ t5 }/>
            <Tile text='Accidents' src={ t2 }/>
            <Tile text='Achievements' src={ t4 }/>
            <Tile text='Computer world' src={ t6 }/>
         </section>
      </section>
   )
}

export default TilesCont
