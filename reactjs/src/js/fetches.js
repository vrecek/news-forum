export const fetchPost = async (url, body=null, method='POST', turnOffControllerAbort=true) => {
   try{
      const controller = new AbortController()
      if(turnOffControllerAbort){
         setTimeout(() => {
            controller.abort()
         }, 8000);
      }

      const opt = {
         method: method,
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(body),
         signal: controller.signal
      }
   
      const res = await fetch(url, opt)
      if(!res.ok){
         if(res.status === 400) return await res.json()
         
         const err = new Error(res.statusText)
         err.code = res.status
         throw err
      } 

      return await res.json()
   }catch(err){
      let msg = ''

      if(err.code === 404 && method === 'DELETE'){
         msg = 'Can not find fetch address. Contact us if you encounter this more times.'
         return new Promise((resolve,reject) => reject({ message: msg, code: err.code, success: false }))
      }

      switch(err.code){     
         case 20: 
            msg = 'Server waited too long for response'; 
            break;
         case 404: 
            msg = 'Can not find fetch address. Contact us if you encounter this more times.'
            break;
         default: 
            msg = err.message
            return new Promise((resolve,reject) => reject({ message: msg, code: err.code, success: false }))
      }

      return new Promise((resolve,reject) => resolve({ msg: msg, success: false }))
   } 
}

export const fetchGet = async url => {
      const res = await fetch(url)

      if(!res.ok){
         throwError(res.statusText, res.status)
      }

      const data = await res.json()

      if(data.ok === false){
         throwError(data.msg, data.code)
      }

      return data
}

// error func help
function throwError(msg, code){
   const err = new Error(msg)
   err.code = code
   throw err
}