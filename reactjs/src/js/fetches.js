export const fetchPost = async (url, body) => {
   try{
      const controller = new AbortController()
      setTimeout(() => {
         controller.abort()
      }, 8000);

      const opt = {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(body),
         signal: controller.signal
      }
   
      const res = await fetch(url, opt)

      if(!res.ok){
         const err = new Error(res.statusText)
         err.code = res.status
         throw err
      } 

      return await res.json()
   }catch(err){
      let msg = ''

      switch(err.code){     
         case 20: 
            msg = 'Server waited too long for response'; 
            break;
         case 404: 
            msg = 'Can not find fetch address. Contact us if you encounter this more times.'
            break;
         default: 
            msg = err.message //reject
      }

      return new Promise((resolve,reject) => resolve({ msg: msg, success: false }))
   } 
}

export const fetchGet = async url => {
   try{
      const res = await fetch(url)

      if(!res.ok){
         throwError(res.statusText, res.status)
      }

      const data = await res.json()

      if(data.ok === false){
         throwError(data.msg, data.code)
      }

      return data
   }catch(error){ 
      switch(error.code){
         case 404:
            error.message = 'Can not find fetch url address.'
            break;

         default:
            break;
      }

      throw error
   }
}

// error func help
function throwError(msg, code){
   const err = new Error(msg)
   err.code = code
   throw err
}