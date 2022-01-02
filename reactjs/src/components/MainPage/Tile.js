import React from 'react'
import back from '../../images/tileBack.png'

const Tile = ({ text, src }) => {
   return (
      <div style={{ background:`url('${back}')`, backgroundSize: '100%' }}>
         <figure>
            <img src={ src } alt='tile' />
         </figure>
         <p>{ text }</p>
      </div>
   )
}

Tile.defaultProps = {
   text: 'Tile'
}

export default Tile
