// PRIVATE

const getType = thing => Object.prototype.toString.call(thing)

const isValidDate = d => getType(d) === '[object Date]' && !isNaN(d)

// formatDate returns a date string for use in an NCBI query. It favours less specific
// dates (e.g. year only) where possible.
const formatDate = date => {
  if (!isValidDate(date)) {
    throw new Error('date must be a valid Date type')
  }

  const toStr = num => num.toString().padStart(2, '0')

  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()]
  if (day === 1) {
    return month === 0 ? year : `${year}/${toStr(month + 1)}`
  }
  return `${year}/${toStr(month + 1)}/${toStr(day)}`
}

// PUBLIC

const searchDb = fetchFn => dbName => async queryStr =>
  fetchFn(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=${dbName}&${queryStr}`)

// assembleDateFilter returns a function that, given a date range, returns a query sub-string
// which can be concatenated with an existing query string to filter by date
const assembleDateFilter = dateType => {
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
    let result = dateTypeStr
    if (min) {
      result += `&mindate=${formatDate(min)}`
    }
    if (max) {
      result += `&maxdate=${formatDate(max)}`
    }
    return result
  }
}

module.exports = {
  assembleDateFilter,
  searchDb
}
