import React from 'react'
import '../../css/SearchCont.css'
import { BsSearch } from 'react-icons/bs'
import { AiFillCaretDown } from 'react-icons/ai'

const SearchCont = () => {
   function focusFunc(e, action){
      const span = e.target.parentElement.childNodes[2]
      const val = e.target.value

      if(action === 'focus'){
         span.className = 'focused'
         e.target.style.borderColor = 'goldenrod'
      }else if(action === 'blur' && val === ''){
         span.className = ''
         e.target.style.borderColor = 'rgb(131, 131, 255)'
      }
   }

   return (
      <div id='searchcont' className='searchcont'>
         <ul>
            <li>Lorem <AiFillCaretDown /> </li>
            <li>Ipsume <AiFillCaretDown /> </li>
            <li>Dolores <AiFillCaretDown /> </li>
            <li>Conesqetaur <AiFillCaretDown /> </li>
         </ul>
         <div>
            <BsSearch />
            <input spellCheck='false' onBlur={ (e)=>focusFunc(e,"blur") } onFocus={ (e)=>focusFunc(e,"focus") } type='text' />
            <span>search...</span>
         </div>
      </div>
   )
}

export default SearchCont
