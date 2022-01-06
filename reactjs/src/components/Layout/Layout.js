import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Nav from './Nav'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'
import '../../css/Necc.css'
import { useRef, useEffect } from 'react'
import Footer from './Footer'

const Layout = (props) => {
   const arrref = useRef(null)
   useEffect(() => {
      const svg = arrref.current.childNodes[1]
      svg.addEventListener('click', () => window.scrollTo(0,0) )
      
      window.addEventListener('scroll', () => {
         if(window.scrollY >= 1000){
            svg.style.pointerEvents = 'auto'
            svg.style.opacity = '1'
         }else{
            svg.style.pointerEvents = 'none'
            svg.style.opacity = '0'
         }
      })
   }, [])

   return (
      <>
         <Router>
            <div ref={ arrref } className='uparr'> <BsFillArrowUpCircleFill /> </div>

            <Nav />
            {
               props.children
            }
            <Footer />
         </Router>
      </>
   )
}

export default Layout
