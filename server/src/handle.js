const ncbi = require('./ncbi')

const verify = res => {
  if (res.status !== 200) {
    throw new Error(`endpoint responded with status code ${res.status}`)
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) // TODO: should be replaced with a client with proper rate limiting queue

// getCountForTermInYearRange takes a function that fetches counts and an array of params
// and returns an array of promises that each resolve
// to a formatted count for a year. Array is in (in reverse order) and covers full
// range, or as as far back as we can go before running out of records
const getCountForTermInYearRange = getCount => async ({ disease, from, to }) => {
  const byPublicationDate = ncbi.byDateTypeAndRange('publication')
  const byDisease = ncbi.byTerm(disease)

  const res = await getCount(byDisease)
  verify(res)
  const data = await res.json()

  let remaining = ncbi.getResultCount(data)

  const allYears = []

  while (remaining > 0 && to >= from) {
    const year = new Date(to, 0)

    const yearRes = await getCount(byDisease, byPublicationDate({ min: year, max: year }))
    verify(yearRes)
    const yearData = await yearRes.json()

    const count = ncbi.getResultCount(yearData)
    allYears.push({
      year: year.getFullYear(),
      count: count
    })

    await sleep(100) // NCBI allows 10 requests per second, but this solution is brittle as hell

    to--
    remaining -= count
  }
  return allYears
}

module.exports = {
  getCountForTermInYearRange
}
