export function shuffle(arr){
   let currInd = arr.length
   let randInd = null

   while(currInd !== 0){
      randInd = Math.floor(Math.random() * currInd)
      currInd--

      [ arr[currInd], arr[randInd] ] = [ arr[randInd], arr[currInd] ]
   }

   return arr
}