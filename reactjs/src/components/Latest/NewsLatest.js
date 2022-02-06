import React from 'react'

const NewsLatest = ({ shortText, category, data, title, contentType, base64, views, id }) => {
   const redirectNews = () => window.location.href = `/news/${ id }`

   return (
      <article onClick={ redirectNews }>
         <img src={`data:image/${ contentType };base64,${ base64 }`} alt='newsimg' />
         <div>
            <h3>Category: <span>{ category }</span></h3>   
            <h3>Posted: <span>{ data }</span></h3>  
         </div>
         <h2>{ title }</h2>
         <p>{ shortText }</p>
         <h4>Views: { views }</h4>
      </article>
   )
}

NewsLatest.defaultProps = {
   category: 'Dolore',
   data: '22.02.22 18:45',
   title: 'Title lorem ipsum',
   text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. consequat. consequat. consequat. consequat. consequat. consequat.',
   views: '68381'
}

export default NewsLatest
