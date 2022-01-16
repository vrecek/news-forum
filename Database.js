// ALL REQUIRED DEPENDENCIES
const mongoose = require('mongoose')
const validator = require('email-validator')
const fetch = require('node-fetch')
const crypto = require('crypto-js')

class Database{

   /* CONSTRUCTOR */
   constructor(uri = null, schemaObj = null){
      this.uri = uri
      this.options = {
         useNewUrlParser: true
      }

      /* schemaObj MUST BE A OBJECT 
         { 
            document_db_name: reference_to_mongoose_model
         }
      */
      if(!schemaObj) return
      try{
         for(let x in schemaObj){
            if(!(schemaObj[x].prototype instanceof mongoose.Model)){
               this.__throw400(`All schemas must be instance of mongoose Model`) 
            }      
         }

         this.schemas = schemaObj
      }catch(err){
         throw err
      }  
   }
   /* ----------------------------------------------------------------------------------- */


   /* CONNECT TO DATABASE */
   async connect(){   
      await mongoose.connect(this.uri, this.options)
      console.log(`Connected to database.`)
   }
   /* ----------------------------------------------------------------------------------- */


   /* ----------------------------------------------------------------------------------- */
   /*                                   GET REQUESTS                                      */
   /* ----------------------------------------------------------------------------------- */


   // -------------------------------------- VIEW ALL ITEMS IN model DOCUMENT ------------------------------------------------

   // searchOptions: { string, searchWhat, returnValue, limit }
   async viewAll(model, searchOptions = null){
      try{
         // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
         if(!this.schemas[model]){ 
            this.__throw500(`Model: -${model}- does not exist in class instance schemas.`)
         }


         // searchWhat MUST BE A STRING WITH WORDS SEPARATED BY SPACE
         if(searchOptions){
            searchOptions.string = searchOptions.string ?? ''               //  default: not working
            searchOptions.searchWhat = searchOptions.searchWhat ?? '_id'   //  default: searchs for _id
            searchOptions.returnValue = searchOptions.returnValue ?? ''   //  default: return all
            searchOptions.limit = searchOptions.limit ?? '0'             //  default: no limit

            if(!this.schemas[model].schema.paths[searchOptions.searchWhat]){ 
               this.__throw500(`Field -${searchOptions.searchWhat}- does not exist on ${model} model`)
            }

            // searchWhat SPLIT INTO ARRAY TO USE ON $or find() METHOD TO SEARCH FIELDS PASSED BY USER
            const regex = new RegExp(searchOptions.string, 'i')
            const split = searchOptions.searchWhat.split(' ')
            const words = []
            for(let x of split){
               words.push({
                  [x]: regex
               })
            }

            // RETURN FOUND ITEMS
            const result = await this.schemas[model].find({ $or: words })
                                                       .select(searchOptions.returnValue)
                                                       .limit(searchOptions.limit)
            return result
         }else{  
            // RETURN ALL   
            const allNews = await this.schemas[model].find()
            return allNews
         }
      }catch(err){
         throw err
      }
   }


   // -------------------------------------------- VIEW ONE ITEM IN model DOCUMENT ------------------------------------------------
   // fix
   async viewOne(model, value, findBy = '_id'){
      if(!this.schemas[model]){ 
         this.__throw500(`Model: -${model}- does not exist in class instance schemas.`)
      }

      if(findBy === '_id'){
         const user = await this.schemas[model].findById(value)
         //return user.length !== 0 ? user : false
         console.log(user)
         return 'xd'
      }
   }


   // -------------------------------------------- VIEW ARRAY IN model DOCUMENT ------------------------------------------------

   // model MUST BE A STRING TO MODEL PASSED IN CONSTRUCTOR
   // documentId MUST BE A STRING OF !VALID! ID WHICH YOU WANT SEARCH
   // arrayName IS ARRAY NAME IN DOCUMENT
   // filterItemId MUST BE STRING ID TO FILTER MONGOOSE ID'S
   async viewArray(model, documentId, arrayName, filterItemId = false){
      // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
      if(!this.schemas[model] || !this.schemas[model].schema.paths[arrayName]){ 
         this.__throw500(`Model / Field: -${model}- does not exist in class instance schemas.`)
      }

      // MAKE SURE id IS A STRING
      const id = documentId.toString()

      // CHECK IF PASSED ID IS VALID MONGOOSE ID
      // IF NO, RETURN EMPTY ARRAY
      // ELSE SELECT ARRAY PASSED ARGUMENT
      let fullArray = null
      try{
         const doc = await this.schemas[model].find({ _id: id })
         fullArray = doc[0][arrayName]
      }catch(err){
         return []
      }
      
      // IF USER WANT FILTER, FILTERS ID AND RETURNS ELEMENT WITH filterItemId ID
      // ELSE RETURN ALL ELEMENTS
      if(filterItemId && typeof filterItemId === 'string' && Array.isArray(fullArray)){
         const filtered = fullArray.filter(x => x._id.toString() === filterItemId)
         return filtered
      }else return fullArray
   }


   // -------------------------------------------- CHECK IF EXISTS IN model ------------------------------------------------

   // model, searchField, searchValue MUST BE A STRING
   // ! CHECKS ONLY ONE FIELD, NOT MULTIPLE LIKE IN viewAll() METHOD !
   // RETURNS TRUE OR FALSE
   async doesExists(model, searchedField, searchValue){

      // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
      if(!this.schemas[model]){ 
         this.__throw500(`Model: -${model}- does not exist in class instance schemas.`)
      }

      // IF USER DID NOT PASS searchedField OR searchValue RETURN TRUE
      // IF IN model MODEL searchedField FIELD DOES NOT EXIST, THROW ERROR
      if(!searchedField || !searchValue) return true
      if(!this.schemas[model].schema.paths[searchedField]){ 
         this.__throw500(`Field -${searchedField}- does not exist on ${model} model`)
      }  

      const found = await this.schemas[model].find({ [searchedField]: searchValue })
                                             .select('_id')

      return found.length !== 0
   }


   /* ----------------------------------------------------------------------------------- */
   /*                           PASSPORT LOCAL, EXPRESS SESSION                           */
   /* ----------------------------------------------------------------------------------- */


   // ---------------------------------- CHECK IF IS AUTHENTICATED ------------------------------------------------

   // RETURNS true AND user IF TRUE, ELSE RETURN false AND null
   async isAuthed(request, model){

      // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
      if(!this.schemas[model]){ 
         this.__throw400(`Model: -${model}- does not exist in class instance schemas.`)
      }

      if(request.isAuthenticated()){
         const user = await this.schemas[model].findById(request.session.passport.user)
         
         return { result: true, user: user }
      }else return { result: false, user: null }
   }


   /* ----------------------------------------------------------------------------------- */
   /*                                 POST / PUT REQUESTS                                 */
   /* ----------------------------------------------------------------------------------- */


   // -------------------------------------------- CREATE ONE MODEL ------------------------------------------------

   // model MUST BE A STRING NAME FOR MONGOOSE MODEL REFERENCE
   // addAllDefault MUST BE A BOOLEAN
   // body MUST BE A OBJECT
   async createOne(model, addAllDefault = false, body){

      // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
      if(!this.schemas[model]){ 
         this.__throw400(`Model: -${model}- does not exist in class instance schemas.`)
      }

      const fields = this.schemas[model].schema.paths
      
      // IF addAllDefault IS FALSE, NEW MODEL WILL BE CREATED BASED ON body
      if(addAllDefault === false){
         for(let x in fields){

            // SKIP THE DEFAULT VALUES AND _id AND __v
            if(fields[x].options.default || (x === '_id' || x === '__v') ) continue
            console.log(body[x])
            // IF FIELD IN body IS NOT PRESENT IN PASSED MODEL, THROW ERROR 
            if(typeof body[x] === 'undefined'){ 
               this.__throw400(`Cant find model required: -${x}- field in passed body.`)
            }
         }

         // CREATE AND SAVE
         const newModel = new this.schemas[model](body)
         await newModel.save()

       // IF addAllDefault IS TRUE, FILL ALL FIELDS WITH DEFAULT VALUES
      }else if(addAllDefault === true){
         const bodyDef = {}

         for(let x in fields){

            // SKIP THE DEFAULT VALUES AND _id AND __v
            if(fields[x].options.default || (x === '_id' || x === '__v') ) continue

            // FILL FIELDS WITH DIFFERENT DATA, DEPENDS ON TYPE
            switch(fields[x].instance){
               case 'String': 
                  bodyDef[x] = 'Default String'
                  break;

               case 'Number': 
                  bodyDef[x] = 123
                  break;

               case 'Date': 
                  let data = new Date()
                  data = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
                  bodyDef[x] = data
                  break;

               default:
                  this.__throw400('Unkown model type! Please change addAllDefault to false')
            }
         }

         // CREATE AND SAVE
         const newModel = new this.schemas[model](bodyDef)
         await newModel.save()

       // IF addAllDefault IS NOT BOOLEAN, THROW ERROR
      }else this.__throw400(`addAllDefault must be a boolean. Got -${addAllDefault}- instead.`)
   }


   // -------------------------------------------- UPDATE ONE MODEL ------------------------------------------------

   // model MUST BE A STRING NAME FOR MONGOOSE MODEL REFERENCE
   // whichOneDocumentUpdate WILL BE A SEARCH QUERY ; MUST BE A OBJECT { db_field: value }
   // updateWhatField MUST BE A STRING AND THIS WILL BE UPDATED
   // body IS A REPLACING VALUE, DEPENDS ON SCHEMA TYPE, IT COULD BE STRING, OBJECT, ETC
   // isThisArray BOOLEAN, IF YES, PUSHES TO ARRAY OTHERWISE NORMAL UPDATE 
   async updateOne(model, whichOneDocumentUpdate, updateWhatField, body, isThisArray = false){
      
      // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
      if(!this.schemas[model]){ 
         this.__throw500(`Model: -${model}- does not exist in class instance schemas.`)
      }

      // IF updateWhatField DOES NOT EXIST THROW ERROR
      if(!this.schemas[model].schema.paths[updateWhatField]){
         this.__throw500(`Field: -${updateWhatField}- does not exist on ${model} model.`)
      }

      // GET THE whichOneDocumentUpdate KEY AND VALUE
      let field, value
      for(let [key,val] of Object.entries(whichOneDocumentUpdate)){
         [field, value] = [key,val]
      }

      // IF field DOES NOT EXIST THROW ERROR
      if(!this.schemas[model].schema.paths[field]){
         this.__throw500(`Field: -${updateWhatField}- does not exist on ${model} model.`)
      }

      // SEARCH THROUGH MODEL ; CHECK IF FIELD CAN BE UPDATED (DOES EXIST?)
      const searched = await this.schemas[model].find({ [field]: value })
      if(searched.length === 0) return false

      // IF isThisArray IS TRUE, PUSH TO ARRAY
      if(isThisArray){
         await this.schemas[model].findOneAndUpdate(whichOneDocumentUpdate, { $push: { [updateWhatField]: body } })
         return true
      }
      // ELSE REGULAR UPDATE
      await this.schemas[model].findOneAndUpdate(whichOneDocumentUpdate, { [updateWhatField]: body })
      return true
   }


   // ------------------------------------------ UPDATE MODEL ARRAY ------------------------------------------------

   // model MUST BE A MODEL IN CONSTRUCTOR
   // modelId IS A VALID MONGOOSE ID TO MODEL WHICH CONTAIN ARRAY
   // arrayName, array_id_or_index IS SELF-EXPLANATORY ; STRINGS
   // arrayField IS ARRAY FIELD STRING
   async updateArray(model, modelId, arrayName, array_id_or_index, arrayField, value){

      // IF model MODEL WAS NOT PASSED IN CONSTRUCTOR THROW ERROR
      if(!this.schemas[model]){ 
         this.__throw500(`Model: -${model}- does not exist in class instance schemas.`)
      }

      // MAKE SURE MODEL AND ARRAY EXIST
      const main_model = await this.schemas[model].find({ _id: modelId })
      const arr = main_model[0][arrayName]  
      if(!Array.isArray(arr)){
         this.__throw500(`-arrayName- is not an array. Got ${typeof arr} instead`)
      }

      // SEARCH ARRAY BY INDEX OR ID
      const isNumber = /^[0-9]+$/.test(array_id_or_index.toString())
      
      if(isNumber){
         // index
      }else{
         // ID
         const arrSelect = `${arrayName}._id`
         const arrField = `${arrayName}.$.${arrayField}`

         await this.schemas[model].updateOne({ _id: modelId, [arrSelect]: array_id_or_index }, 
         { $set:
             { [arrField]: value } 
         })

         return true
      }
   }

   /* ----------------------------------------------------------------------------------- */
   /*            NICKNAME, MAIL, PASSWORD, CONFIRM PASSWORD, CHECKBOX, CAPTCHA            */
   /* ----------------------------------------------------------------------------------- */


   // ---------------------------------------------------- VALIDATE STRING ----------------------------------------------------

   // CHECK IF IS ALPHANUMERIC
   // CHECK IF HAVE min AND max LENGTH OKAY
   // arrayToAddError IS EITHER false OR PASSED ARRAY
   validateNick_AlphaNumeric(str, min = 0, max = 999, arrayToAddError = false){
      const regex = /^[a-z0-9 ]+$/i
      let success = true
      let errMsg = ''

      if(!str){
         errMsg = 'Nickname is empty'
         success = false
      }else if(!regex.test(str)){
         errMsg = 'Nickname must contain only alphanumeric signs'
         success = false
      }else if(str.length < min){
         errMsg = `Nickname must have minimum ${min} signs`
         success = false
      }else if(str.length > max){
         errMsg = `Nickname can't have more than ${max} signs`
         success = false
      }

      // IF arrayToAddError IS ARRAY: CHECK IF THERE WAS AN ERROR, IF YES, ADD TO PASSED ARRAY AND RETURN TRUE, OTHERWISE DONT DO NOTHING
      // ! PUSHES VALUE TO ORIGINAL PASSED ARRAY !
      if(Array.isArray(arrayToAddError)){
         if(errMsg) arrayToAddError.push(errMsg)
         return true
      }
      // ELSE RETURN   { success: bool  AND  errMsg: string (empty or with message) }
      return { success, errMsg }   
   }


   // ---------------------------------------------------- VALIDATE EMAIL ADDRESS ---------------------------------------------------

   // arrayToAddError IS EITHER false OR PASSED ARRAY
   validateEmail(mail, arrayToAddError = false){
      let success = true
      let errMsg = ''

      if(mail.length < 3){
         errMsg = 'Mail must be minimum 3 characters long'
         success = false
      }else if(mail.length > 254){
         errMsg = 'Mail address allows maximum 254 characters'
         success = false
      }else if(!validator.validate(mail)){
         errMsg = 'Passed mail address is incorrect'
         success = false
      }

      // IF arrayToAddError IS ARRAY: CHECK IF THERE WAS AN ERROR, IF YES, ADD TO PASSED ARRAY AND RETURN TRUE, OTHERWISE DONT DO NOTHING
      // ! PUSHES VALUE TO ORIGINAL PASSED ARRAY !
      if(Array.isArray(arrayToAddError)){
         if(errMsg) arrayToAddError.push(errMsg)
         return true
      }
      // ELSE RETURN   { success: bool  AND  errMsg: string (empty or with message) }
      return { success, errMsg }
   }


   // --------------------------------------------------- VALIDATE PASSWORD(S) ---------------------------------------------------

   // arrayToAddError IS EITHER false OR PASSED ARRAY
   // CHECK IF HAVE min AND max LENGTH OKAY
   // IF confirmPassword IS A STRING: pass AND confirmPassword WILL BE CHECKED IF THEY'RE THE SAME
   validatePassword(pass, min = 0, max = 999, arrayToAddError = false, confirmPassword = false){
      const illegal = ['<', '>', '-', '&', '=', '.', ':']
      let success = true
      let errMsg = ''

      if(typeof confirmPassword === 'string'){
         if(!(pass === confirmPassword)){
            errMsg = `Passwords are not the same`
            success = false
         }
      }else{
         for(let x of illegal){
            if(pass.indexOf(x) !== -1){
               errMsg = `Password illegal characters: < > - & = . :`
               success = false
               break
            }
         }
   
         if(pass.length < min){
            errMsg = `Password must have minimum ${min} characters`
            success = false
         }else if(pass.length > max){
            errMsg = `Password must have maximum ${max} characters`
            success = false
         }
      }
      
      // IF arrayToAddError IS ARRAY: CHECK IF THERE WAS AN ERROR, IF YES, ADD TO PASSED ARRAY AND RETURN TRUE, OTHERWISE DO NOTHING
      // ! PUSHES VALUE TO ORIGINAL PASSED ARRAY !
      if(Array.isArray(arrayToAddError)){
         if(errMsg) arrayToAddError.push(errMsg)
         return true
      }
      // ELSE RETURN   { success: bool  AND  errMsg: string (empty or with message) }
      return { success, errMsg }  
   }


   // --------------------------------------------------- CHECK CHECKBOX ---------------------------------------------------

   // arrayToAddError IS EITHER false OR PASSED ARRAY
   // checkVal MUST BE A BOOLEAN
   // CAN ADD CUSTOM FAIL MESSAGE
   validateCheck(checkVal, errorMessage = 'Please check the box to continue', arrayToAddError){
      let success = true
      let errMsg = ''

      if(checkVal === false){
         errMsg = errorMessage
         success = false
      }

      // IF arrayToAddError IS ARRAY: CHECK IF THERE WAS AN ERROR, IF YES, ADD TO PASSED ARRAY AND RETURN TRUE, OTHERWISE DONT DO NOTHING
      // ! PUSHES VALUE TO ORIGINAL PASSED ARRAY !
      if(Array.isArray(arrayToAddError)){
         if(errMsg) arrayToAddError.push(errMsg)
         return true
      }
      // ELSE RETURN   { success: bool  AND  errMsg: string (empty or with message) }
      return { success, errMsg } 
   }


   // --------------------------------------------------- VERIFY CAPTCHA ---------------------------------------------------

   // clientResponse: KEY FROM CLIENT SIDE CAPTCHA
   // secretKey: SECRET KEY FROM GOOGLE RECAPTCHA
   // remoteIp: USER IP ADDRESS
   // arrayToAddError IS EITHER false OR PASSED ARRAY
   async verifyCaptcha(clientResponse, secretKey, remoteIp, arrayToAddError){
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${clientResponse}&remoteip=${remoteIp}`

      const response = await fetch(url, { method: 'POST' })
      const data = await response.json()

      let success = true
      let errMsg = ''

      if(!data.success){
         errMsg = 'Please complete captcha'
         success = false
      }

      // IF arrayToAddError IS ARRAY: CHECK IF THERE WAS AN ERROR, IF YES, ADD TO PASSED ARRAY AND RETURN TRUE, OTHERWISE DONT DO NOTHING
      // ! PUSHES VALUE TO ORIGINAL PASSED ARRAY !
      if(Array.isArray(arrayToAddError)){
         if(errMsg) arrayToAddError.push(errMsg)
         return true
      }
      // ELSE RETURN   { success: bool  AND  errMsg: string (empty or with message) }
      return { success, errMsg } 
   }


   /* ----------------------------------------------------------------------------------- */
   /*                          CREATE HASH  -OR-  VERIFY HASH                             */
   /* ----------------------------------------------------------------------------------- */

   // --------------------------------------------------- GENERATE HASH ---------------------------------------------------

   // password MUST BE A STRING
   // RETURNS GENERATED salt AND hash
   generateHash(password){
      const salt = crypto.lib.WordArray.random(128 / 8).toString()
      const hash = crypto.PBKDF2(password, salt, {
         keySize: 512 / 32
      }).toString()

      return { salt, hash }
   }

   
   // --------------------------------------------------- VERIFYING HASH ---------------------------------------------------

   // password, userHash AND userSalt MUST BE A STRING
   // userHash AND userSalt FROM USER SCHEMA UPON REGISTERING
   // RETURNS boolean
   verifyHash(password, userHash, userSalt){
      const hash = crypto.PBKDF2(password, userSalt, {
         keySize: 512 / 32
      }).toString()

      return hash === userHash
   }


   /* ----------------------------------------------------------------------------------- */
   /*                                  HELPER METHODS                                     */
   /* ----------------------------------------------------------------------------------- */


// --------------------------------------------------- THROW CODE 500 ERROR -------------------------------------------------

   __throw500(msg){
      const err = new TypeError(msg)
      err.code = 500
      err.ok = false
      throw err
   }

   __throw404(msg){
      const err = new Error(msg)
      err.code = 404
      err.ok = false
      throw err
   }

}

module.exports = Database