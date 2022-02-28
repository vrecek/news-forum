import React from 'react'
import '../../css/ForumEntryPage.css'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchGet } from '../../js/fetches'
import { Loading } from '../../js/Loading'
import { FiUsers } from 'react-icons/fi'
import { AiOutlineFieldTime, AiOutlineCheckCircle, AiOutlineStar, AiOutlineLike, AiOutlineComment, AiOutlineTrophy, AiOutlineLaptop, AiOutlineWarning, AiOutlinePlus } from 'react-icons/ai'
import { GiEarthAmerica, GiSpaceNeedle } from 'react-icons/gi'
import { FaSkullCrossbones } from 'react-icons/fa'
import { FcIdea } from 'react-icons/fc'
import EntryCatSection from './EntryCatSection'
import cats from './categories.json'
import LiveChat from './LiveChat'

const EntryPage = () => {
   const [user, setUser] = useState(null)
   const navigate = useNavigate()

   const svgobj = {
      trophy: <AiOutlineTrophy />,
      earth: <GiEarthAmerica />,
      warning: <AiOutlineWarning />,
      space: <GiSpaceNeedle />,
      laptop: <AiOutlineLaptop />,
      skull: <FaSkullCrossbones />,
      bulb: <FcIdea />
   }

   const artOptions = [
      {
         icon: <AiOutlinePlus />,
         hovText: 'Add new',
         action: () => window.location.href='/forum/main/write-new'
      }
   ]
   

   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         load.attach()

         try{    
            const data = await fetchGet('/api/users/is-authed')
            setUser(data)

         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
            
         }finally{ load.delete() }
      })()
   }, [navigate])

   return (
      <main className='forum-entry-page'>
         <section className='fep-wrap'>
            <div className='f-logcheck'>
               {
                  user?.result ?
                     <p>Welcome, <span>{ user.user.username }</span></p>
                  :
                  <>
                     <p>You are not logged</p>
                     <div>
                        <a href='/login'>Sign in</a> / <a href='/register'>Register</a>
                     </div>
                  </>
               }
            </div>

            <nav>
               <ul>
                  <li style={{borderLeft: '1px solid orangered'}}> <AiOutlineCheckCircle /> <span>Main</span></li>
                  <li style={{borderRight: '1px solid orangered'}}> <AiOutlineFieldTime /> <span>Waiting</span></li>
                  <li> <AiOutlineLike /> <span>Most liked</span></li>
                  <li> <AiOutlineComment /> <span>Most commented</span></li>
                  <li style={{borderRight: '1px solid orangered'}}> <AiOutlineStar /> <span>Most favourite</span></li>
                  <li> <FiUsers /> <span>Users</span></li>
               </ul>
            </nav>

            <section>
               <div className='f-para-anim'> <p>Lorem ipsum dolor sit amet conqesatur</p> </div>

               <div className='line'> <p>General</p> </div>
               <EntryCatSection
                  title='Main section' 
                  svg={ <AiOutlineCheckCircle /> } 
                  desc='General, more like informative section. There is no specific category and all topics are listed vertically.'
                  action={ () => window.location.href = '/forum/main' }
                  optionsSet={ artOptions }
               />
               <EntryCatSection
                  title='Waiting room' 
                  svg={ <AiOutlineFieldTime /> } 
                  desc='Waiting room for main section. Articles in there are waiting for approve until they will be in section above'
               />
               <div className='line'> <p>Categories</p> </div>
               {
                  cats.map((x,i) => (
                     <EntryCatSection key={ i } desc={ x.desc } upc={ true } title={ x.title } svg={ svgobj[x.svg] } />
                  ))
               }
            </section>
         </section>

         {
            user && <LiveChat nick={ user?.user?.username } />
         }
         
      </main>
   )
}

export default EntryPage