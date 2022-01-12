export function passwordVisible(e){
   e.target.classList.toggle('toggled')

   if(e.target.classList.contains('toggled')){
      const span = document.createElement('span')
      span.className = 'toggled'
      e.target.appendChild(span)

      e.target.parentElement.children[1].type='text'
   }else{
      e.target.children[1].remove()
      e.target.parentElement.children[1].type='password'
   }
}