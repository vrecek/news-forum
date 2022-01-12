import React from 'react'

const News = ({ src, title, date }) => {
   return (
      <article style={{ backgroundImage: `url(${src})` }}>
         <h3>{ title }</h3>
         <h4>{ date }</h4>
      </article>
   )
}

News.defaultProps = {
   src: 'https://indianapublicmedia.org/wpimages/amomentofscience/2013/05/104_smoking.jpg',
   title: 'News text title',
   date: '29.09.2021'
}

export default News
