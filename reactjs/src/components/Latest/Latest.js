import React from 'react'
import '../../css/Latest.css'
import Button from '../Reusable/Button'
import NewsLatest from './NewsLatest'
import { useState, useEffect, useRef } from 'react'
import { fetchGet } from '../../js/fetches'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'
import { BsFilterCircleFill } from 'react-icons/bs'

const Latest = () => {
   const [news, setNews] = useState(null)
   const [pages, setPages] = useState(null)
   const out_sect = useRef(null)
   const navigate = useNavigate()

   function redirect(e){
      const nr = e.target.textContent
      window.location.href = `/latest-news/${nr}`
   }

   useEffect(() => {
      const cont = out_sect.current.children[0]
      const outer = out_sect.current
      const str = out_sect.current.children[2]

      window.addEventListener('resize', () => {
         if(window.innerWidth > 768){
            cont.style.height = 'auto'
            str.style.display = 'none'
            outer.style.height = 'auto'
            outer.classList.add('active')
         }
      })
      
      out_sect.current.children[1].addEventListener('click', () => {
         if(outer.classList.contains('active')){
            cont.style.height = '0'
            outer.style.height = '30px'
            str.style.display = 'block'
            outer.classList.remove('active')
         }else{
            cont.style.height = '380px'
            outer.style.height = '380px'
            str.style.display = 'none'
            outer.classList.add('active')
         }     
      })
   }, [])

   useEffect(() => {
      (async () => {
         const load = new Loading(document.body, true)
         try{
            load.attach()
            
            const path = window.location.pathname
            const nr = parseInt( path.slice(path.indexOf('s/') + 2) )

            const numpages = await fetchGet('/api/news/pages')

            if(nr > numpages.length){
               const err = new Error(`Page ${nr} does not exist! Dont mess with URL`)
               err.code = 404
               throw err
            }

            let data = null
            if(nr && nr !== 1){
               window.numpl = nr
               data = await fetchGet(`/api/news/page/${nr}`)
            }else{
               window.numpl = 1
               data = await fetchGet('/api/news')
            }

            for(let x of data){
               let shortText = x.text.slice(0, 220).split(' ')
               shortText.splice(-1, 1)
               shortText = shortText.join(' ').concat('...').replace(/{-bh}|{bh-}|{-sh}|{sh-}/g, '')    
               Object.assign(x, { shrt: shortText })
            }
            setNews(data)
            setPages(numpages)
            
         }catch(err){
            navigate('/error', { state: { msg: err.message, code: err.code } })
         }finally{
            load.delete()
         }
      })()
   }, [navigate])

   return (
      <main className='latest'>
         <h1 className='lat-header'>Latest news</h1>
         <section ref={ out_sect } className='out-sect'>
            <section className='filter-cont'>
               <div>
                  <label>Views:</label>
                  <select>
                     <option>DEFAULT</option>
                     <option>Descending</option>
                     <option>Ascending</option>      
                  </select>
               </div>
               <div>
                  <label>Date:</label>
                  <select>
                     <option>DEFAULT</option>
                     <option>Newest</option>
                     <option>Oldest</option>      
                  </select>
               </div>
               <div>
                  <label>Alphabet:</label>
                  <select>
                     <option>DEFAULT</option>
                     <option>A - Z</option>
                     <option>Z - A</option>      
                  </select>
               </div>
               <Button text='Filter' cname='n' />
            </section>
            <BsFilterCircleFill />
            <h5>Filter</h5>
         </section>

         <section className='main-cont'>
            {
               news && news.map(x => (
                  <NewsLatest 
                     key={ x._id } 
                     id={ x._id }
                     base64={ x.image.data }
                     contentType={ x.image.contentType } 
                     category={ x.category } 
                     data={ x.data } 
                     title={ x.title } 
                     text={ x.shortTitle } 
                     views={ x.views } 
                     shortText={ x.shrt }
                  />
               ))
            }
         </section>

         <section className='numpage'>
            {
               pages && pages.map((x,i) => (
                  <div onClick={ redirect } className={ (x === window.numpl).toString() } key={ i }>{ x }</div>
               ))
            }
         </section>
      </main>
   )
}

export default Latest
