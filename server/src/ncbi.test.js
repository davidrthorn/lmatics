const { searchDb, byDateTypeAndRange } = require('ncbi')

describe('searchDb', () => {
  describe('when input is valid', () => {
    const db = 'someDb'
    const query = 'key1=val1&key2=val2'

    it('should call fetch function with the correct query string', () => {
      let calledWith = null
      const fetchFn = url => { calledWith = url }

      searchDb(fetchFn)(db)(query)
      expect(calledWith).toBe(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=someDb&key1=val1&key2=val2' // FIXME: no longer a pure function as it reads from the env; also missing params
      )
    })
  })
})

describe('byDateTypeAndRange', () => {
  describe('when given a valid dateType and day-specific min/max', () => {
    const min = new Date(2000, 2, 24)
    const max = new Date(2019, 3, 4)
    it('should return a date filter string with full dates in correct format', () => {
      const got = byDateTypeAndRange('publication')({ min, max })
      expect(got).toBe('datetype=pdat&mindate=2000/03/24&maxdate=2019/04/04')
    })
  })

  describe('when given a valid dateType and month-only min/max', () => {
    const min = new Date(2000, 2)
    const max = new Date(2019, 11)
    it('should return a date filter string with year/month only', () => {
      const got = byDateTypeAndRange('publication')({ min, max })
      expect(got).toBe('datetype=pdat&mindate=2000/03&maxdate=2019/12')
    })
  })

  describe('when given a valid dateType and year-only min/max', () => {
    const min = new Date(2000, 0) // must supply month, otherwise interpreted as milliseconds
    const max = new Date(2019, 0)
    it('should return a date filter string with year only', () => {
      const got = byDateTypeAndRange('publication')({ min, max })
      expect(got).toBe('datetype=pdat&mindate=2000&maxdate=2019')
    })
  })

  describe('when given an invalid date type', () => {
    it('should throw an exception', () => {
      expect(() => { byDateTypeAndRange('notValid') }).toThrow()
    })
  })

  describe('when given only one date', () => {
    const min = new Date(2000, 0)
    it('should throw an exception', () => {
      byDateTypeAndRange('publication')({ min })
      expect(() => { byDateTypeAndRange('publication') }).toThrow()
    })
  })

  describe('when given an invalid date', () => {
    let min = '2020/12/20' // dates must be actual js Dates
    const max = '2020/11/20' // dates must be actual js Dates
    it('should throw an exception for strings', () => {
      expect(() => { byDateTypeAndRange('publication')({ min, max }) }).toThrow()
    })

    min = new Date('blah')
    min = new Date('bloh')
    it('should throw an exception for malformed Date', () => {
      expect(() => { byDateTypeAndRange('publication')({ min, max }) }).toThrow()
    })
  })
})
