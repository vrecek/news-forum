import React from 'react'
import Header from './Header'
import SliderCont from './SliderCont'
import TilesCont from './TilesCont'
import SearchCont from './SearchCont'
import LeftSect from './LeftSect'
import Aside from './Aside'
import Feedback from './Feedback'

const MainPage = () => {
   /* 
      
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
            <Feedback />
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
