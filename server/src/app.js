const ncbi = require('./ncbi')
const fetch = require('node-fetch')
const cors = require('cors')
const express = require('express')

const app = express()
const port = 3000 // FIXME: load from environment
const host = 'http://localhost' // FIXME: load from enviroment

app.use(cors({
  origin: 'http://localhost:1234' // FIXME: change this to read from ENV
}))

app.get('/health', (req, res) => res.send('Healthy'))
app.get('/search', searchHandler)

app.listen(port, () => console.log(`Example app listening at ${host}:${port}`))

const fail = res => (code, msg) => {
  console.log(msg)
  res.status = code
  res.json({
    success: false,
    errors: [
      msg
    ]
  })
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) // should be replaced with a proper rate limiting client

// getCountForYearRange returns an array of promises that each resolve
// to a formatted count for a year in the range (in reverse order),
// or for as far back from the max year we can go before running out of papers
async function getCountForYearRange ({ disease, from, to }) {
  const getPubMedCount = ncbi.searchDb(fetch)(true)('pubmed')
  const byPublicationDate = ncbi.byDateTypeAndRange('publication')
  const byTerm = ncbi.byTerm(disease)

  const response = await getPubMedCount(byTerm)
  const data = await response.json()
  let remaining = ncbi.getResultCount(data)

  const allYears = []

  while (remaining > 0 && to >= from) {
    const year = new Date(to, 0)
    const byTermAndYear = ncbi.composeFilters([
      byTerm,
      byPublicationDate({ min: year, max: year })
    ])

    const yearResponse = await getPubMedCount(byTermAndYear)
    const yearData = await yearResponse.json()

    const count = ncbi.getResultCount(yearData)
    allYears.push({
      year: year.getFullYear(),
      count: count
    })

    await sleep(100) // TODO: don't hardcode this

    to--
    remaining -= count
  }
  return allYears
}

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

function searchHandler (req, res) {
  const failRes = fail(res)
  const params = req.query
  const [isValid, message] = validateSearchParams(params)

  if (!isValid) {
    failRes(400, message)
    return
  }

  getCountForYearRange(formatParams(params))
    .then(allYears => {
      Promise.all(allYears)
        .then(yearsArray => {
          res.json({
            success: true,
            errors: [],
            data: yearsArray.reverse()
          })
        })
        .catch(reason => { failRes(500, reason.message) })
    })
    .catch(reason => { failRes(500, reason.message) })
}
