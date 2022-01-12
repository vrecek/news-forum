export class Loading{

   // element: ELEMENT TO ATTACH LOADING GIF
   // autostyle: AUTOMATICALLY STYLE LOADING GIF
   // divClassname: IF autostyle IS FALSE, SPECIFY YOUR OWN HTML CLASS 
   constructor(element, autostyle = true, divClassname = null){
      this.element = element
      this.divClassname = divClassname
      this.autostyle = autostyle
      this.gif = 'https://thumbs.gfycat.com/UglyUnripeAzurewingedmagpie-max-1mb.gif'

      // PRIVATE FIELD TO HELP DELETE CREATED ELEMENT
      this._div = null
   }


   // ATTACH CREATED ELEMENT TO element FIELD
   attach(){
      const img = document.createElement('img')
      const div = document.createElement('div')
      this._div = div

      // AUTOMATIC STYLE ON CENTER OF THE SCREEN
      if(this.autostyle){
         div.style.position = 'fixed'
         div.style.left = '0'
         div.style.top = '0'
         div.style.width = '100%'
         div.style.height = '100%'
         div.style.zIndex = '9999999999'
         div.style.background = 'rgba(0,0,0,.5)'
         div.style.display = 'flex'
         div.style.justifyContent = 'center'
         div.style.alignItems = 'center'

         img.style.height = '50%'
      }else{
         div.className = this.divClassname ?? ''
      }

      img.src = this.gif
      div.appendChild(img)
      this.element.appendChild(div)
   }


   // REMOVE CREATED ELEMENT
   delete(){
      this._div.remove()
   }

}