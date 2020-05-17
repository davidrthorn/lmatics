// PRIVATE

const isValidDate = thing => Object.prototype.toString.call(thing) === '[object Date]' && !isNaN(thing)

// formatDate returns a date string for use in an NCBI query. It returns only year or year/month
// if possible (e.g. 1990/01/01 is just 1990)
function formatDate (date) {
  if (!isValidDate(date)) {
    throw new Error('date must be a valid Date type')
  }

  const toStr = num => num.toString().padStart(2, '0') // NCBI probably don't require this, but docs state YYYY/MM/DD

  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()]
  if (day === 1) {
    return month === 0 ? year : `${year}/${toStr(month + 1)}`
  }
  return `${year}/${toStr(month + 1)}/${toStr(day)}`
}

// PUBLIC

// TODO: too many parameters -- this should be split into smaller dependencies
const searchDb = fetchFn => apiKey => dbName => countOnly => async (...filters) => {
  const f = composeFilters(...filters)
  let query = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmode=json&apikey=${apiKey}&db=${dbName}&${f}`
  if (countOnly) {
    query += '&rettype=count'
  }
  return fetchFn(query)
}

const byTerm = term => `term=${encodeURI(term)}` // TODO: test that this is encoded

// assembleDateFilter returns a function that, given a date range, returns a query sub-string
// which can be concatenated with an existing query string to filter by date
const byDateTypeAndRange = dateType => {
  const entrezDateType = {
    publication: 'pdat',
    Entrez: 'edat',
    modification: 'mdat'
  }[dateType]

  if (!entrezDateType) {
    throw new Error(`unrecognised dateType: '${dateType}'`)
  }

  const dateTypeStr = 'datetype=' + entrezDateType

  // min, max must be of type Date
  return ({ min, max }) => {
    if (!min || !max) {
      throw new Error('esearch will return all records unless BOTH min AND max are set')
    }
    return `${dateTypeStr}&mindate=${formatDate(min)}&maxdate=${formatDate(max)}`
  }
}

const composeFilters = (...filters) => filters.join('&').trimRight('&')

function getResultCount (esearchResponse) {
  const esearchResult = esearchResponse.esearchresult
  if (!esearchResult) {
    throw new Error('missing esearch result')
  }

  const count = esearchResult.count
  if (!count) {
    throw new Error('missing count')
  }

  return parseInt(count)
}

module.exports = {
  byDateTypeAndRange,
  byTerm,
  composeFilters,
  getResultCount,
  searchDb
}
