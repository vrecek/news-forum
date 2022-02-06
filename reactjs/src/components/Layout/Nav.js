import React from 'react'
import '../../css/Nav.css'
import logo from '../../images/logo.png'
import { AiOutlineFire,AiOutlineHome,AiOutlineMail,AiOutlineQuestionCircle,AiFillLock,AiOutlinePoweroff,AiOutlineUser } from 'react-icons/ai'
import { BiWorld, BiLogIn, BiUserPlus, BiMessageDetail, BiEnvelope } from 'react-icons/bi'
import { MdOutlineForum, MdOutlinePrivacyTip } from 'react-icons/md'
import { HiPencil } from 'react-icons/hi'
import { FaUserCog } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchGet } from '../../js/fetches'
import { Loading } from '../../js/Loading'

const Nav = () => {
   const [toggle, setToggle] = useState(false)
   const [logged, setLogged] = useState(false)
   const [avatar, setAvatar] = useState(null)
   const navigate = useNavigate()
   const perc = [20, 50, 80];

   const redirectProfile = () => {
      window.location.href = `/user/${logged.user.username}`
   }

   function toggleMenu(e){
      const targ = e.target
      const spans = [targ.childNodes[0],targ.childNodes[1],targ.childNodes[2]]
      const menu = targ.parentElement.childNodes[2]

      if(!toggle){
         spans.forEach((it,ind) => {
            it.style.background = 'red'
            it.style.borderColor = 'red'
            it.style.top = '50%' 

            if(ind === 2) return

            it.style.transform = 'translate(-50%,-50%) rotate(135deg)'           
         })
         spans[2].style.transform = 'translate(-50%,-50%) rotate(40deg)'

         menu.style.transform = 'translateX(0)'
         
         setToggle(true)
      }else{
         spans.forEach((it,ind) => {
            it.style.background = 'none'
            it.style.borderColor = 'white'
            it.style.top = `${perc[ind]}%`  
            it.style.transform = 'translate(-50%, 0) rotate(0deg)'       
         })
         menu.style.transform = 'translateX(100%)'

         setToggle(false)
      }
   }

   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)

         try{
            load.attach()
   
            const data = await fetchGet('/api/users/is-authed')

            if(data.user){
               const data_avatar = await fetchGet('/api/users/get-avatar')

               const notViewedMsgs = data.user.messages.filter(x => x.viewed === false)

               setAvatar(data_avatar)
               setLogged({ result: data.result, user: data.user, msgs: notViewedMsgs.length })
            }else{
               setLogged({ result: data.result, user: data.user })
            }     
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{ load.delete() }
      })()
   }, [navigate])

   return (
      <nav className='nav'>
         <div className='image'>
            <img src={ logo } alt='logo' />
         </div>

         <ul>
            <li> <Link to='/'> <AiOutlineHome /> <span>Homepage</span> </Link> </li>
            <li> <Link to='/latest-news'> <AiOutlineFire /> <span>Latest</span> </Link></li>
            <li> <Link to='/'> <BiWorld /> <span>Popular</span> </Link></li>
            <li> <Link to='/'> <MdOutlineForum /> <span>Forum</span> </Link> </li>
         </ul>

         <section>
            {
               logged.result ?
               <section className='loggedicons'>
                  <a per='Messages' href='/my-messages'> <BiMessageDetail />
                     { logged.msgs !== 0 && <span>{ logged.msgs }</span> } 
                  </a>
                  <a onClick={ redirectProfile } per='Profile'> 
                     { 
                        avatar && avatar.source ? 
                           <div><img src={`data:image/${avatar.content};base64,${avatar.source}`} alt='avatar_error' /></div>
                        : 
                           <AiOutlineUser /> 
                     } 
                  </a>
                  <p className='log-as'>Logged: <span>{ logged.user.username }</span></p>
               </section>
               :
               <button onClick={ ()=>window.location.href = '/login' }>Login</button>
            }
   
            <div onClick={ toggleMenu }>
               <span></span>
               <span></span>
               <span></span>
            </div>
            <aside>
               <ol>
                  {
                     logged.result ? 
                     <>
                        <a onClick={ redirectProfile }> <li className='first'>  <AiOutlineUser /> <span>Profile</span> </li> </a>
                        <a href='/user-settings'> <li>  <FaUserCog /> <span>Settings</span> </li> </a>
                        <a href='/my-messages'> <li>  <BiEnvelope /> <span>Messages</span> </li> </a>
                        <a className='logout-red' href='http://localhost:5000/api/users/logout'> <li> <AiOutlinePoweroff /> <span>Logout</span> </li></a>
                     </>
                     :
                     <>
                        <Link to='/login'> <li className='first'> <BiLogIn /> <span>Sign in</span> </li> </Link>
                        <Link to='/register'> <li> <BiUserPlus /> <span>Register</span> </li></Link>
                     </>
                  }
                  
                  <li className='line'></li>
                  {
                     logged?.user?.role !== 'normal' && 
                     <a href='/write-news'> <li className='write-article'>  <HiPencil /> <span>Write new article</span> </li></a>
                  }
                  <Link to='/'> <li>  <AiOutlineHome /> <span>Homepage</span> </li></Link>
                  <Link to='/'> <li>  <MdOutlineForum /> <span>Forum</span> </li></Link>
                  <a href='/latest-news'> <li>  <AiOutlineFire /> <span>Latest news</span> </li></a>
                  <Link to='/'> <li>  <BiWorld /> <span>Now popular</span> </li></Link>
                  <li className='line'></li>
                  <Link to='/'> <li>  <AiFillLock /> <span>Terms &amp; Services</span> </li></Link>
                  <Link to='/'> <li>  <MdOutlinePrivacyTip /> <span>Privacy policy</span> </li></Link>
                  <Link to='/contact'> <li>  <AiOutlineMail /> <span>Contact us</span> </li></Link>
                  <a href='/about'> <li className='last'>  <AiOutlineQuestionCircle /> <span>About</span> </li></a>
               </ol>
            </aside>
         </section>
      </nav>
   )
}

export default Nav
