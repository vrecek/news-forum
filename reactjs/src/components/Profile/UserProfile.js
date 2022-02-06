import React from 'react';
import '../../css/UserProfile.css'
import { useState, useEffect, useRef } from 'react';
import { fetchGet, fetchPost } from '../../js/fetches';
import { Loading } from '../../js/Loading';
import { useNavigate } from 'react-router-dom';
import { BsJournalRichtext } from 'react-icons/bs'
import { AiFillLike, AiFillDislike, AiOutlineComment, AiOutlineFieldTime, AiOutlineMail, AiOutlineEye } from 'react-icons/ai'
import { BiPencil } from 'react-icons/bi'
import { MdOutlineCategory } from 'react-icons/md'
import EditDesc from './EditDesc';
import CreateMessage from '../Messages/CreateMessage'

const UserProfile = () => {
   const [us, setUs] = useState(null)
   const [isMine, setIsMine] = useState(false)
   const [imLogged, setImLogged] = useState(false)
   const edRef = useRef()
   const formRef = useRef()
   const descRef = useRef()
   const navigate = useNavigate()

   async function saveChanges(e){
      e.preventDefault()

      const load = new Loading(e.target.parentElement.parentElement, false, 'loadgif')

      try{
         load.attach()

         const text = [e.target.parentElement.parentElement.elements[0].value]

         const data = await fetchPost('/api/users/change-desc', text)
         if(data) window.location.reload()
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{ load.delete() } 
   }

   function toggleEdit(e){
      e.preventDefault()
      
      const curr = edRef.current
      if(curr.classList.contains('showed')){
         curr.style.transform = 'translateY(-100%) scale(0)'
      }else{
         curr.style.transform = 'translateY(0) scale(1)'
      }
      curr.classList.toggle('showed')
   }

   function toggleForm(e){
      e.preventDefault()
      
      const curr = formRef.current
      if(curr.classList.contains('showed')){
         curr.style.transform = 'translate(-50%,-50%) scale(0)'
      }else{
         curr.style.transform = 'translate(-50%,-50%) scale(1)'
      }
      curr.classList.toggle('showed')
   }

   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         const userQuery = window.location.pathname.replace(/\/user\//ig, '')

         try{
            load.attach()

            const data = await fetchGet(`/api/users/by-name/${ userQuery }`)
            const auth = await fetchGet('/api/users/is-authed')

            const text_new_line = data.aboutMe.replace(/\n/g, '<br/>')
            const space = text_new_line.replace(/ /g, '&nbsp;')

            descRef.current.innerHTML = space
            setIsMine({ is_mine: userQuery === auth.user?.username, im_log: auth.result })
            setUs(data)
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete() }
      })()
   }, [navigate])

   return (
      <main className='profile'>
         <EditDesc save={ saveChanges } cancel={ toggleEdit } reference={ edRef } currDesc={ us?.aboutMe } />
         <CreateMessage is_profile_send={ true } toggleF={ toggleForm } refere={ formRef } />

         <article className='wrap'>
            <section className='leftprof'>
               <figure>
                  { 
                     us && us.content ? 
                        <img src={`data:image/${ us.content };base64,${ us.source }`} alt='error-user-img'/>
                     :
                        <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' alt='error-user-img' />
                  }
               </figure>
               {
                  us?.role !== 'normal' && <h5 className={ us?.role }>{ us?.role }</h5>
               }
               <h3>Username <span>{ us && us.username }</span></h3>
               <h4>First name <span>{ us && us.firstname }</span></h4>
               <h4>Surname <span>{ us && us.lastname }</span></h4>
               <h4>Birthday <span>{ us && us.birthday }</span></h4>
               <h4>Gender <span>{ us && us.gender }</span></h4>
               <h4>Nationality <span>Poland</span></h4>
               <h4>Joined <span>{ us && us.data }</span></h4>
            </section>

            <section className='rightprof'>
               <div className='picons'>
                  {
                     isMine?.is_mine && isMine?.im_log && <span onClick={ toggleEdit } per='Edit descripiton'><BiPencil /></span>
                  }
                  {
                     !isMine?.is_mine && isMine?.im_log && <span onClick={ toggleForm } per='Message'><AiOutlineMail /></span>
                  }             
               </div>
               <fieldset>
                  <legend> <BsJournalRichtext /> My description <BsJournalRichtext /></legend>
                  <p ref={ descRef }>

                  </p>
               </fieldset>

               <div className='fp'><h2>User forum posts</h2></div>
               <section className='fpdiv'>
                  <article>
                     <div>
                        <h5>Title jd jd here lol</h5>
                        <h6><AiOutlineFieldTime />Posted: <span>12-12-2001 18:43</span></h6>
                        <h6><MdOutlineCategory />Category: <span>Lorems</span></h6>
                     </div>
                     <div>
                        <h6><AiFillLike />Likes: <span>303</span></h6>
                        <h6><AiFillDislike />Dislikes: <span>9</span></h6>
                        <h6><AiOutlineComment />Comments: <span>45</span></h6>
                        <h6><AiOutlineEye />Views: <span>45</span></h6>
                     </div>
                  </article>
                  <article>
                     <div>
                        <h5>Title jd jd here lol</h5>
                        <h6><AiOutlineFieldTime />Posted: <span>12-12-2001 18:43</span></h6>
                        <h6><MdOutlineCategory />Category: <span>Lorems</span></h6>
                     </div>
                     <div>
                        <h6><AiFillLike />Likes: <span>303</span></h6>
                        <h6><AiFillDislike />Dislikes: <span>9</span></h6>
                        <h6><AiOutlineComment />Comments: <span>45</span></h6>
                        <h6><AiOutlineEye />Views: <span>45</span></h6>
                     </div>
                  </article>
               </section>
            </section>
         </article>
      </main>
   )
};

export default UserProfile;
