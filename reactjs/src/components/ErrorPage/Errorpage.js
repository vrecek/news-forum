import React from 'react'
import { useLocation } from 'react-router-dom'

const Errorpage = () => {
   const state = useLocation().state
   console.log(state)
   return (
      <div>
         err
      </div>
   )
}

export default Errorpage
