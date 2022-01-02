import React from 'react'
import '../../css/Header.css'
import Button from '../Reusable/Button'
import { MdKeyboardArrowDown } from 'react-icons/md'

const Header = () => {
   return (
      <header className='header'>
         <h1>Searching for unkown and community?</h1>
         <p>
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
         </p>
         <div>
            <Button action={ ()=>window.location.href='#searchcont' } text='News' cname='n' />
            <Button text='Forum' cname='n' />
         </div>
         <MdKeyboardArrowDown />
         <MdKeyboardArrowDown />
         <MdKeyboardArrowDown />
      </header>
   )
}

export default Header
