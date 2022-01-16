import React from 'react'
import { TiMessage } from 'react-icons/ti'

const Message = ({ title, date, from, status, id }) => {
   const red_msg = id => window.location.href = `/my-messages/${id}`
   return (
      <article onClick={ () => red_msg(id) }>
         <div className='icon'>
            <TiMessage />
         </div>

         <div className='text'>
            <h4><span>Title:</span> { title }</h4>
            <h4 className='from'><span>From:</span> { from }</h4>
            <i className={ status.toString() }>status: { status ? 'viewed' : 'unread' }</i>
         </div>

         <div className='date'>
            <h5>Recieved:</h5>
            <h6>{ date }</h6>
         </div>
      </article>
   )
}

Message.defaultProps = {
   title: 'Random title lorem ipsum!',
   date: '13.02.2022 - 18:25',
   from: 'user213s',
   status: 'false'
}

export default Message
