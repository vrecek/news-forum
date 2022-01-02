import React from 'react'
import '../../css/Aside.css'
import AsideArticle from './AsideArticle'

const Aside = () => {
   return (
      <aside>
         <h5>Featured articles</h5>
         <AsideArticle src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg' />
         <AsideArticle src='https://www.w3schools.com/howto/img_nature_wide.jpg' />
         <AsideArticle src='https://global.jaxa.jp/projects/rockets/h3/images/h3_main_001.jpg' />
         <h5>Related topics</h5>
         <a className='reltop' href='/'>Lorem</a>
         <a className='reltop' href='/'>Ipsum</a>
         <a className='reltop' href='/'>Dolore</a>
         <a className='reltop' href='/'>Sit amet</a>
      </aside>
   )
}

export default Aside
