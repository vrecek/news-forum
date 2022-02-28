import React from 'react'
import '../../../css/ForumMain.css'
import TopicArticle from './TopicArticle'
import { fetchGet } from '../../../js/fetches'
import { Loading } from '../../../js/Loading'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForumMain = () => {
   const [arts, setArts] = useState(null)
   const [user, setUser] = useState(null)

   const loc = window.location.pathname
   const pageNr = loc.slice(loc.indexOf('main') + 5) || 1

   const navigate = useNavigate()
   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         load.attach()

         try{
            const data = await fetchGet(`/api/forumgeneral/${pageNr}`)
            const authuser = await fetchGet('/api/users/is-authed')

            setUser(authuser)
            setArts(data)

         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
            
         }finally{ load.delete() }
      })()
   }, [])

   return (
      <main className='f-route-main'>
         <section className='frm-wrap'>
            <h6 className='f-m-path'>
               <a href='/'>Homepage</a> &gt; 
               <a href='/forum'>Forum</a> &gt; 
               General
            </h6>
            {
               arts && arts.posts.map(x => (
                  <TopicArticle
                     id={x._id}
                     key={x._id}
                     title={x.title}
                     text={x.text}
                     data={x.postData}
                     comments={x.comments}
                     likes={x.likes}
                     dislikes={x.dislikes}
                     authorname={x.postAuthor.name}
                     authoravatar={x.postAuthor.avatar}
                     imageStrings={x.uploadedImagesString}
                     imageBin={x.uploadedImages}
                     auth={ user && user }
                     wl={x.whoLiked}
                     wdl={x.whoDisliked}
                     fav={x.whosFav}
                     pageNr={pageNr}
                  />
               ))
            }
         </section>
         <section className='num-pages'>
            {
               arts && arts.pnum.map((x,i) => (
                  <div 
                     key={i}
                     className={ x === parseInt(pageNr) ? 'active' : '' } 
                     onClick={ () => window.location.href=`/forum/main/${x}` }>
                     { x }
                  </div>
               ))
            }
         </section>
      </main>
   )
}

export default ForumMain