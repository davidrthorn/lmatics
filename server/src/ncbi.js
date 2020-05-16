
const getType = thing => Object.prototype.toString.call(thing)

const isDate = date => getType(date) === '[object Date]'

const searchDb = fetchFn => dbName => async queryStr => fetchFn(`db=${dbName}&${queryStr}`)

// formatDate returns a date string for use in an NCBI query. It favours less specific
// dates (e.g. year only) where possible.
const formatDate = date => {
  if (!isDate(date)) {
    throw new Error(`expected type 'date', got type '${getType(date)}'`)
  }

  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDay()]

  if (day === '01') {
    return month === '01' ? year : `${year}/${month}`
  }
  return `${year}/${month}/${day}`
}

// assembleDateFilter returns a function that, given a date range, returns a query sub-string
// which can be concatenated with an existing query string to filter by date
const assembleDateFilter = dateType => {
  const entrezDateTypes = {
    publication: 'pdat',
    Entrez: 'edat',
    modification: 'mdat'
  }
  if (!(dateType in entrezDateTypes)) {
    throw new Error(`unrecognised dateType: '${dateType}'`)
  }
  const dateTypeParam = 'datetype=' + entrezDateTypes[dateType]

  return ({ min, max }) => {
    let result = dateTypeParam
    if (min !== undefined) {
      result += '&mindate=' + formatDate(min)
    }
    if (min !== undefined) {
      result += '&maxdate=' + formatDate(max)
    }
    return result
  }
}

module.exports = {
  assembleDateFilter,
  searchDb
}
