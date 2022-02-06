import React from 'react'
import { useLocation } from 'react-router-dom'
import '../../css/Errorpage.css'
import img from '../../images/error-image.png'

const Errorpage = () => {
   let {msg, code} = useLocation().state
   code = code ?? 500
   msg = msg ?? 'Unkown error'

   return (
      <main className='errorpage'>
         <section>
            <img src={ img } alt='error' />
            <h1>An error occured!</h1>
            <h2>If you did nothing and see this, please contact us</h2>
         </section>

         <section>
            <h3>Error details:</h3>
            <h4>Message</h4>
            <p>{ msg }</p>

            <h4>Code</h4>
            <p>{ code }</p>
         </section>
      </main>
   )
}

export default Errorpage
