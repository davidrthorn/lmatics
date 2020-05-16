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

const getCountForYearRange = async ({ disease, minYear, maxYear }) => {
  const getPubMedCount = ncbi.searchDb(fetch)(true)('pubmed')
  const byPublicationDate = ncbi.byDateTypeAndRange('publication')

  const response = await getPubMedCount(ncbi.byTerm(disease))
  const data = await response.json()
  let remaining = parseInt(data.esearchresult.count) || 0

  const allYears = []

  while (remaining > 0 && maxYear >= minYear) {
    const year = new Date(maxYear, 0)
    const byTermAndYear = ncbi.composeFilters([
      ncbi.byTerm(disease),
      byPublicationDate({ min: year, max: year })
    ])

    const yearResponse = await getPubMedCount(byTermAndYear)
    const yearData = await yearResponse.json()

    const count = parseInt(yearData.esearchresult.count)
    allYears.push({
      year: year.getFullYear(),
      count: count
    })

    maxYear--
    await sleep(120) // TODO: don't hardcode this

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
        .then(value => {
          res.json(value)
        })
        .catch(reason => {
          console.log(reason) // TODO: something better
        })
    })
    .catch(reason => {
      console.log(reason)
    })
}
