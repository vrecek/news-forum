import React from 'react'
import '../../css/SearchCont.css'
import { BsSearch } from 'react-icons/bs'
import { AiFillCaretDown } from 'react-icons/ai'
import { useRef, useEffect } from 'react'

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

   const ulRef = useRef(null)
   useEffect(() => {      
      ulRef.current.childNodes.forEach(element => {
         element.addEventListener('click', toggleList)
      })
   }, [])
   
   function toggleList(e){
      const li = e.target 
      const ol = li.childNodes[2]

      const isClicked = li.classList.contains('clicked');

      if(isClicked){
         li.className = 'outer'
         ol.style.height = '0px'
      }else{
         li.parentElement.childNodes.forEach((it,ind) => {
            it.childNodes[2].style.height = '0px'  
            it.parentElement.childNodes[ind].className = 'outer'
         })
         
         li.className = 'outer clicked'
         ol.style.height = '350px'
      }
   }

   return (
      <div id='searchcont' className='searchcont'>
         <ul ref={ ulRef }>
            <li className='outer'>Lorem <AiFillCaretDown /> 
               <ol className='innerlist'>
                  <ul>
                     <li>Voluptatem</li>
                     <li>Harum</li>
                     <li>Explicabo</li>
                     <li>Quisquam</li>
                     <li>Voluptas</li>
                     <li>Ducimus</li>
                     <li>Quidem</li>
                  </ul>
                  <ul>
                     <li>Numquam</li>
                     <li>Excepturi</li>
                     <li>Dolorum fuga</li>
                     <li>Placeat</li>
                     <li>Saepe</li>
                     <li>Omnis</li>
                     <li>Qui blanditiis</li>
                  </ul>
                  <ul>
                     <li>Reiciendis</li>
                     <li>Alias</li>
                     <li>Reiciendis</li>
                     <li>Delectus</li>
                     <li>Tenetur</li>
                     <li>Sapiente</li>
                     <li>In culpa</li>
                  </ul>
                  <ul>
                     <li>Eveniet</li>
                     <li>At vero</li>
                     <li>Accusamus</li>
                     <li>Blanditiis</li>
                     <li>Facere</li>
                     <li>Aliquid</li>
                     <li>Quam nihil</li>
                  </ul>
               </ol>
            </li>

            <li className='outer'>Ipsume <AiFillCaretDown /> 
               <ol className='innerlist'>
                  <ul>
                     <li>Explicabo</li>
                     <li>Eum fugiat</li>
                     <li>Aliquam</li>
                     <li>Quam nihil</li>
                     <li>Tempora</li>
                     <li>Incidunt</li>
                     <li>Labore</li>
                  </ul>
                  <ul>
                     <li>Quisquam</li>
                     <li>Magnam </li>
                     <li>Aliquam</li>
                     <li>Labore</li>
                     <li>Iste natus</li>
                     <li>Perspiciatis</li>
                     <li>Blanditiis</li>
                  </ul>
                  <ul>
                     <li>Ducimus</li>
                     <li>Veniam</li>
                     <li>Dolorem</li>
                     <li>Quaerat</li>
                     <li>Enim ipsam</li>
                     <li>Porro</li>
                     <li>Architecto</li>
                  </ul>
                  <ul>
                     <li>Dignissimos</li>
                     <li>Vitae dicta </li>
                     <li>Nesciunt</li>
                     <li>Natus error</li>
                     <li>Sed ut</li>
                     <li>Dicta sunt</li>
                     <li>Illum</li>
                  </ul>
               </ol>
            </li>

            <li className='outer'>Dolores <AiFillCaretDown />
               <ol className='innerlist'>
                  <ul>
                     <li>Commodi</li>
                     <li>Blanditiis</li>
                     <li>Adipisci</li>
                     <li>Inventore</li>
                     <li>Quae ab</li>
                     <li>Officia</li>
                     <li>Harum</li>
                  </ul>
                  <ul>
                     <li>A sapiente</li>
                     <li>Molestias</li>
                     <li>Culpa qui</li>
                     <li>Facere</li>
                     <li>Cum soluta</li>
                     <li>Et quas</li>
                     <li>Atque</li>
                  </ul>
                  <ul>
                     <li>Inventore</li>
                     <li>Corrupti</li>
                     <li>Quisquam</li>
                     <li>Quam</li>
                     <li>Nulla</li>
                     <li>Eum fugiat</li>
                     <li>Ducimus</li>
                  </ul>
                  <ul>
                     <li>Dignissimos</li>
                     <li>Et harum</li>
                     <li>Earum rerum</li>
                     <li>Consequatur</li>
                     <li>Temporibus</li>
                     <li>At vero eos</li>
                     <li>Voluptas</li>
                  </ul>
               </ol>
            </li>

            <li className='outer'>Conesqetaur <AiFillCaretDown /> 
               <ol className='innerlist'>
                  <ul>
                     <li>Nesciunt</li>
                     <li>Quisquam</li>
                     <li>Velit</li>
                     <li>Ipsam</li>
                     <li>Adipisci velit</li>
                     <li>Aliquam</li>
                     <li>Sed ut</li>
                  </ul>
                  <ul>
                     <li>Accusantium</li>
                     <li>Exercitationem</li>
                     <li>Quidem</li>
                     <li>Quos</li>
                     <li>Eum iure</li>
                     <li>Dolorem</li>
                     <li>Consequuntur</li>
                  </ul>
                  <ul>
                     <li>Nostrum</li>
                     <li>Reprehenderit</li>
                     <li>Inventore</li>
                     <li>perspiciatis</li>
                     <li>Omnis iste</li>
                     <li>Quidem</li>
                     <li>Neque</li>
                  </ul>
                  <ul>
                     <li>Nemo enim</li>
                     <li>Sed quia</li>
                     <li>Recusandae</li>
                     <li>Maiores</li>
                     <li>Itaque</li>
                     <li>Debitis</li>
                     <li>Officiis</li>
                  </ul>
               </ol>
            </li>
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
