import React from 'react'

const SliderImg = ({ src, text }) => {
   return (
      <div className='imgcont'>
         <img src={ src } alt='slideimg' />
         <p>{ text }</p>
      </div>
   )
}

export default SliderImg
