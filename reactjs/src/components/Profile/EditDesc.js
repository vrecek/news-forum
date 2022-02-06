import React from 'react';
import '../../css/EditDesc.css'
import Button from '../Reusable/Button'

const EditDesc = ({ reference, cancel, save, currDesc }) => {
   if(currDesc)
   return (
      <section ref={ reference } className='editdesc'>
         <form>
            <textarea defaultValue={ currDesc } spellCheck='false'>

            </textarea>

            <div className='e-btns'>
               <Button action={ cancel } text='Cancel' cname='n' />
               <Button action={ save } text='Save' cname='n' />
            </div>
         </form>
      </section>
   )

   else return ( <section>Loading</section> )
};

export default EditDesc;
