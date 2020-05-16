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

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function getCount (esearchResponse) {
  const esearchResult = esearchResponse.esearchResult
  if (!esearchResult) {
    throw new Error('missing esearch result')
  }

  const count = esearchResult.count
  if (!count) {
    throw new Error('missing count')
  }

  return parseInt(count)
}

async function getCountForYearRange ({ disease, minYear, maxYear }) {
  const getPubMedCount = ncbi.searchDb(fetch)(true)('pubmed')
  const byPublicationDate = ncbi.byDateTypeAndRange('publication')
  const byTerm = ncbi.byTerm(disease)

  const response = await getPubMedCount(byTerm)
  const data = await response.json()
  let remaining = getCount(data)

  const allYears = []

  while (remaining > 0 && maxYear >= minYear) {
    const year = new Date(maxYear, 0)
    const byTermAndYear = ncbi.composeFilters([
      byTerm,
      byPublicationDate({ min: year, max: year })
    ])

    const yearResponse = await getPubMedCount(byTermAndYear)
    const yearData = await yearResponse.json()

    const count = getCount(yearData)
    allYears.push({
      year: year.getFullYear(),
      count: count
    })

    await sleep(120) // TODO: don't hardcode this

    maxYear--
    remaining -= count
  }
  return allYears
}

function searchHandler (req, res) {
  // TODO: validate input
  // TODO: sanitise input

  // FIXME: this is test data
  getCountForYearRange({ disease: 'cancer', minYear: 2006, maxYear: 2010 })
    .then(allYears => {
      Promise.all(allYears)
        .then(yearsArray => {
          res.json({
            success: true,
            errors: [],
            data: yearsArray.reverse()
          })
        })
        .catch(reason => {
          console.log(reason) // TODO: something better
        })
    })
    .catch(reason => {
      console.log(reason)
    })
}
