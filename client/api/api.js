import axios from 'axios'

const PORT = 3002 // subject to change <-- json mock db 
const PATH = 'http://localhost:'

function createBin() {
  return axios.post(PATH + PORT + '/create')
  .then(result => {
    console.log(result.data)
    insertToLocalStorage(result.data) // <--- helper
  })
  .catch(err => console.error(err))
}

function getBinsFromLocalStorage() {
  const bins = JSON.parse(localStorage.getItem('bins'))
  return bins
}

async function getBinFromAPI() {
  let binKeys = JSON.parse(localStorage.getItem('bins'))
  if (!binKeys) return;
  
  // [{}, {}, ...]
  const promises = binKeys.map(b => {
    const bKey = b.binKey
    return axios.get(PATH + PORT + '/' + bKey)
  })

  const values = (await Promise.allSettled(promises))
    .map(pVal => pVal.value.data)

  return values
  
  // return axios.get(PATH + PORT + '/' + binKey)
  //   .then(result => console.log(result.data))
}

function getBinDetails(binKey) {
  return axios.get(PATH + PORT + `/view/${binKey}`)
    .then(result => {
      return result.data
    })
}

export default {
  createBin,
  getBinFromAPI,
  getBinsFromLocalStorage,
  getBinDetails
}

function insertToLocalStorage(result) {
  const bins = JSON.parse(localStorage.getItem('bins')) // [{}, {}]
  if (!bins) { // <--- case if no bins yet
    const ary = [result]
    localStorage.setItem('bins', JSON.stringify(ary))
  } else { // case if there are already bins :D 
    bins.push(result)
    localStorage.setItem('bins', JSON.stringify(bins))
  }
}