import React from 'react'
import '../../css/EntryCatSection.css'

const EntryCatSection = ({ svg, title, upc, desc, action, optionsSet }) => {
  return (
    <article className='e-cat-section-prev'>
      <article onClick={ action } className='e-cat-section'>
        <figure>
          { svg }
        </figure>

        <section className='e-cat-text'>
          <h4 style={ upc && up }>{ title }</h4>
          <p>{ desc }</p>
        </section>

        <div className='e-cat-last'>
          <div>
            <h5>Last post:</h5>
            <h6>12.11 18:46</h6>
          </div>
          <span></span>
          <div>
            <h5>Topic:</h5>
            <h6>Lore ispum dolo ame fd df d fd fdfdd sdsdsdds</h6>
          </div>
        </div>
      </article>

      <div className='additional'>
        {
          optionsSet?.map((x,i) => (
            <span key={i} onClick={ x.action } per={ x.hovText }>{ x.icon }</span>
          ))
        }
      </div>
    </article>
  )
}

const up = { textTransform: 'uppercase' }

export default EntryCatSection