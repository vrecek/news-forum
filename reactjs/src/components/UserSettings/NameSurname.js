import React from 'react';
import '../../css/NameSurname.css'
import Button from '../../components/Reusable/Button'
import { fetchPost } from '../../js/fetches';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../js/Loading'
import { fetchGet } from '../../js/fetches';

const NameSurname = () => {
   const [result, setResult] = useState(null)

   const [avatar, setAvatar] = useState(null)
   const [first, setFirst] = useState(null)
   const [last, setLast] = useState(null)
   const [gen, setGen] = useState(null)
   const [birth, setBirth] = useState(null)
   const [nat, setNat] = useState(null)

   const navigate = useNavigate()

   useEffect(() => {
      (async function init(){
         const load = new Loading(document.body, true)
         load.attach()

         const us = await fetchGet('/api/users/is-authed')

         if(us.user.avatar.data){
            const base64 = btoa(new Uint8Array(us.user.avatar.data.data).reduce(function (data, byte) {
               return data + String.fromCharCode(byte);
            }, ''));
            setAvatar({ source: base64, ct: us.user.avatar.contentType })
         }

         if(us.user.firstname !== 'Not set') setFirst(us.user.firstname)

         if(us.user.lastname !== 'Not set') setLast(us.user.lastname)

         if(us.user.gender !== 'Not set') setGen(us.user.gender)

         if(us.user.birthday !== 'Not set') setBirth(us.user.birthday)

         if(us.user.nationality !== 'Not set') setNat(us.user.nationality)

         load.delete()
      })()
   }, [])

   function genNums(from, to, zeroes = false){
      let i = from
      const arr = []

      if(zeroes){
         while(i <= to){
            arr.push(i<10 ? '0' + i : i)
            i++
         }
      }else{
         while(i <= to){
            arr.push(i)
            i++
         }
      }

      return arr.reverse()
   }
   const days = genNums(1, 31, true)
   const years = genNums(1950, 2022)

   async function personalSend(e){
      e.preventDefault()

      const img = e.target.children[6].children[1].files[0];
      const load = new Loading(e.target.parentElement, false, 'loadgif')

      try{
         load.attach()

         if(img){
            const formdata = new FormData()
            formdata.append('img', img)
   
            const res = await fetch('/api/users/change-avatar', {
               method: 'POST',
               body: formdata
            })
            
            if(res.status === 500) throw new Error('Internal server error')

            const datares = await res.json()
            
            setResult({ success: datares.success, msg: datares.msg })
            if(datares.success) window.location.reload()
            setTimeout(() => {
               setResult(null)
            }, 3000);
         }else{
            const arr = [...e.target.elements].map((x,i) => i < 6 ? x.value : x.checked ? x.value : false)

            const data = await fetchPost('/api/users/change-personal', arr, 'PUT')

            setResult({ success: data.success, msg: data.msg })
            if(data.success) window.location.reload()
            setTimeout(() => {
               setResult(null)
            }, 3000);        
         }  
      }catch(err){
         navigate('/error', { state: { msg: err.message, code: err.code } })
      }finally{ load.delete() }
      
   }

   return (
      <section className='namesurname'>
         <section>
            <h4>Your current name: <span>{ first ? first : 'Not set' }</span> </h4>
            <h4>Your current surname: <span>{ last ? last : 'Not set' }</span> </h4>
            <h4>Your gender: <span>{ gen ? gen : 'Not set' }</span> </h4>
            <h4>Your date of birth: <span>{ birth ? birth : 'Not set' }</span> </h4>
            <h4>Your nationality: <span>{ nat ? nat : 'Not set' }</span> </h4>
            <h4>Your avatar: 
               {
                  avatar ?
                  <div className='usavatar'> <img src={`data:image/${avatar.ct};base64,${avatar.source}`} alt='avatar_error' /> </div>
                  :
                  <span>Not set</span>
               }
            </h4>
         </section>
         <form onSubmit={ personalSend }> 
            <h2>Set your name, surname, birthday and gender</h2>

            <div>
               <h5>First name</h5>
               <input type='text' />
            </div>

            <div>
               <h5>Surname</h5>
               <input type='text' />
            </div>

            <div className='birth'>
               <h5>Birtday</h5>

               <section>
                  <div className='labdiv'>
                     <label>Day</label>
                     <select>
                        <option>None</option>
                        {
                           days.map((x,i) => <option key={ i }>{ x }</option>)
                        }
                     </select>
                  </div>

                  <div className='labdiv'>
                     <label>Month</label>
                     <select>
                        <option>None</option>
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>
                     </select>
                  </div>

                  <div className='labdiv'>
                     <label>Year</label>
                     <select>
                        <option>None</option>
                        {
                           years.map((x,i) => <option key={ i }>{ x }</option>)
                        }
                     </select>
                  </div>
               </section>
            </div>

            <div>
               <h5>Nationality</h5>
               <input type='text' />
            </div>

            <div className='gen'>
               <h5>Gender</h5>
               <section>
                  <div className='labdiv'><label htmlFor='m'>Male</label> <input value='Male' name='selgen' id='m' type='radio' /></div>
                  <div className='labdiv'><label htmlFor='f'>Female</label> <input value='Female' name='selgen' id='f' type='radio' /></div>
                  <div className='labdiv'><label htmlFor='o'>Other</label> <input value='Other' name='selgen' id='o' type='radio' /></div>
               </section>      
            </div>

            <div>
               <h5>Avatar</h5>
               <input name='img' type='file' />
            </div>

            {
               result && <h6 className={ (result.success).toString() }>{ result.msg }</h6>
            }

            <Button text='Save changes' cname='n' />
         </form>
      </section>
   )
};

export default NameSurname;
