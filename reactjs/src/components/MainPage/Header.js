import React from 'react'
import '../../css/Header.css'
import Button from '../Reusable/Button'

const Header = () => {
   /*
      napis srodek quite big ,ozdoba shadow blur etc
      pod nim mniejszy na 2 linij
      2 btny
      go to forum / go to news
   */
   return (
      <header className='header'>
         <h1>Searching for unkown and community?</h1>
         <p>
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
         </p>
         <div>
            <Button text='News' cname='n' />
            <Button text='Forum' cname='n' />
         </div>
      </header>
   )
}

export default Header
