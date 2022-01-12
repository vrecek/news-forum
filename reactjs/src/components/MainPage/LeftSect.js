import React from 'react'
import '../../css/LeftSect.css'
import '../../css/Featured.css'
import '../../css/Numpages.css'
import { useRef, useEffect, useState } from 'react'
import SliderImg from './SliderImg'
import News from './News'
import Featured from './Featured'
import { fetchGet } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'
import { shuffle } from '../../js/shuffle'

const LeftSect = () => {
   const slide = useRef(null)
   const [news, setNews] = useState(null)
   const navigate = useNavigate()

   useEffect(() => {
      const slider = slide.current
      const len = slider.childNodes.length - 1
      const radioArr = slider.parentElement.childNodes[1].childNodes
      let counter = 1

      const load = new Loading(document.body, true)
      load.attach()

      slider.style.transform = `translateX(-100%)`
      radioArr[0].className = 'activeradio'

      setInterval(() => {  
         if(!document.hasFocus()) return

         counter++ 
         slider.style.transition = '1s'  
         slider.style.transform = `translateX(-${100 * counter}%)`
      }, 6000);

      slider.addEventListener('transitionend', () => {
         if(counter === len){
            counter = 1
            slider.style.transition = '0s' 
            slider.style.transform = `translateX(-${100 * counter}%)`

            radioArr[radioArr.length - 1].className = ''
            radioArr[0].className = 'activeradio'
            return
         }

         radioArr[counter - 2].className = ''
         radioArr[counter - 1].className = 'activeradio'
      })

      fetchGet('/api/news')
      .then(data => {
         setNews(shuffle(data))
      })
      .catch(err => { navigate('/error', { state: { msg: err.message, code: err.code } }) })
      .finally(() => load.delete())
   }, [])

   return (
      <section className='leftsection'>
         <figure>
            <div ref={ slide } className='outer'>
               <SliderImg src='https://upload.wikimedia.org/wikipedia/commons/4/45/Wide_lightning.jpg' text='Dolor sit amet ?' />

               <SliderImg src='https://static5.depositphotos.com/1037262/521/i/600/depositphotos_5215941-stock-photo-road-panorama.jpg' text='Labore et nes' />
               <SliderImg src='https://t3.ftcdn.net/jpg/02/32/78/38/240_F_232783878_w8lOB70on1NDrnLcmcC0QuslEB1HTWDF.jpg' text='Unde omnis iste' />
               <SliderImg src='https://upload.wikimedia.org/wikipedia/commons/4/45/Wide_lightning.jpg' text='Dolor sit amet ?' />

               <SliderImg src='https://static5.depositphotos.com/1037262/521/i/600/depositphotos_5215941-stock-photo-road-panorama.jpg' text='Labore et nes' />
            </div> 

            <div className='radiocont'>
               <span></span>
               <span></span>
               <span></span>
            </div>      
         </figure>

         <section className='newsCont'>
            {
               news && news.map(it => (
                  <News key={ it._id } src={ it.image } title={ it.title } date={ it.data } />
               ))
            }
         </section>

         <section className='featured'>
            <Featured src='https://www.transparentpng.com/thumb/robot/white-robot-punching-transparent-png-GXxIMA.png' />

            <div className='separator'></div>

            <Featured src='https://krafos.pl/wp-content/uploads/2020/05/img-m-kontakt-400x400.png' LtR={ false } />
         </section>

         <section className='numpages'>
            <div className='active'>1</div>
            <div>2</div>
            <div>3</div>
            <div className='overflowed'>4</div>
            <div className='overflowed'>5</div>
            <div>...</div>
            <div className='overflowed'>1029</div>
            <div className='overflowed'>1030</div>
            <div>1031</div>
            <div>1032</div>
            <div>1033</div>
         </section>

      </section>
   )
}

export default LeftSect
