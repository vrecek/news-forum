import React from 'react'
import Header from './Header'
import SliderCont from './SliderCont'
import TilesCont from './TilesCont'
import SearchCont from './SearchCont'
import LeftSect from './LeftSect'
import Aside from './Aside'

const MainPage = () => {
   /* 
      obok pare dropdown NA KLIK

      featured
      image lewo i text floatowy
      read more napis not  btn

      2-3-4 100% img i text w srodku info what
      ze 2 rzzedy

      lewwo img prawo text
      i na odrwor
      pare razy

      img duzy pod krotki text i reaed more

      1 2 3 ... 888 889 900
      
      send feedback nodemailer

      footer
   */
   return (
      <>
         <Header />
         <main style={ styl } className='mainpage'>
            <SliderCont />
            <TilesCont />
            <SearchCont />
            <section className='leftright'>
               <LeftSect />
               <Aside />
            </section>
            dsds
         </main>
      </>
   )
}

const styl = {
   background: "url('https://i.imgur.com/GCJRhiA.png')",
   backgroundSize: '100%',
   backgroundAttachment: 'fixed'
}

export default MainPage
