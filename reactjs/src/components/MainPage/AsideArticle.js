import React from 'react'

const AsideArticle = ({ src }) => {
   return (
      <article>
         <figure>
            <img src={ src } alt='article' />
         </figure>
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            <a href='/'>Read more</a>
         </p>
      </article>
   )
}

export default AsideArticle
