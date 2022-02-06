import React from 'react'
import { TiMessage } from 'react-icons/ti'
import { FaTimesCircle } from 'react-icons/fa'
import { fetchPost } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'

const Message = ({ title, date, from, status, id, ajax }) => {
   const navigate = useNavigate()

   const red_msg = id => window.location.href = `/my-messages/${id}`

   const delMsg = async (id,e) => {
      const load = new Loading(e.target.parentElement, false, 'loadgif')
      try{
         load.attach()
         await fetchPost(`/api/users/del-message/${id}`, {}, 'DELETE')
         ajax(id)
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{
         load.delete()
      }
   }

   return (
      <article>
         <div onClick={ () => red_msg(id) } className='wrap'>
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
         </div>

         <span onClick={ (e) => delMsg(id,e) } className='xicon'> <FaTimesCircle /> </span>
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
