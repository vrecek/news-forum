import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Nav from './Nav'

const Layout = (props) => {
   return (
      <>
         <Router>
            <Nav />
            {
               props.children
            }
         </Router>
      </>
   )
}

export default Layout
