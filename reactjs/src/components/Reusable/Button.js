import React from 'react'

const Button = ({ text, cname, action }) => {
   return (
      <button style={ !cname ? basicStyle : null } onClick={ action } className={ cname }>
         <span className='addspan'></span>
         <span className='addspan'></span>
         <span className='addspan'></span>
         <span className='text'>{ text }</span>
      </button>
   )
}

const basicStyle = {
   background: 'none',
   fontSize: '1.1rem',
   border: '2px solid blue',
   padding: '.8em 0',
   width: '20%',
   color: 'white',
   borderRadius: '.3em',
   fontFamily: "'Roboto Mono', monospace",
   cursor: 'pointer'
}

Button.defaultProps = {
   text: 'Button',
   action: () => console.log('Button clicked')
}

export default Button
