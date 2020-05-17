const handle = require('./handle')
const ncbi = require('./ncbi')
const fetch = require('node-fetch')
const cors = require('cors')
const express = require('express')

const app = express()
const port = 3000

app.use(cors())

app.get('/health', (req, res) => res.send('Healthy'))
app.get('/search', searchHandler)

app.listen(port, () => console.log(`Listening on port ${port}`))

const fail = res => (code, msg) => {
  res.status = code
  res.json({ error: msg })
}

// PREPROCESS

const isValidYear = year => /[1-9][0-9]{3}/.test(year)

function validateSearchParams ({ disease, from, to }) {
  if (!disease || !from || !to) {
    return [false, `'disease', 'from' and 'to' are required params. Got: ${disease}, ${from}, ${to}`]
  }
  if (!isValidYear(from) || !isValidYear(to)) {
    return [false, `'from' and 'to' are years formatted as 4-digit ints greater than 999. Got: '${from}', '${to}'`]
  }
  if (from > to) {
    return [false, `'from' must be less than 'to'. Got: ${from}, ${to}`]
  }
  return [true, null]
}

const formatParams = ({ disease, from, to }) => ({
  disease: disease.trim(),
  from: parseInt(from),
  to: parseInt(to)
})

// HANDLE

function searchHandler (req, res) {
  console.log('Received search request')

  const failRes = fail(res)
  const params = req.query
  const [isValid, message] = validateSearchParams(params)

  if (!isValid) {
    failRes(400, message)
    return
  }

  const getPubmedCount = ncbi.searchDb(fetch)(process.env.NCBI_KEY)('pubmed')(true)

  handle.getCountForTermInYearRange(getPubmedCount)(formatParams(params))
    .then(allYears => {
      Promise.all(allYears)
        .then(yearsArray => {
          res.json({ data: yearsArray.reverse() })
        })
        .catch(reason => {
          failRes(500, reason.message)
          console.log('request failed: ' + reason.message)
        })
    })
    .catch(reason => {
      failRes(500, reason.message)
      console.log('request failed: ' + reason.message)
    })
}
