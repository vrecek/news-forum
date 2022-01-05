import React from 'react'

const News = ({ src, text, date }) => {
   return (
      <article style={{ backgroundImage: `url(${src})` }}>
         <h3>{ text }</h3>
         <h4>{ date }</h4>
      </article>
   )
}

News.defaultProps = {
   src: 'https://indianapublicmedia.org/wpimages/amomentofscience/2013/05/104_smoking.jpg',
   text: 'News text title',
   date: '29.09.2021'
}

export default News
