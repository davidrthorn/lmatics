const { searchDb, byDateTypeAndRange, composeFilters, byTerm, getResultCount } = require('./ncbi')

describe('searchDb', () => {
  const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?retmode=json'

  describe('when input is valid', () => {
    it('should call fetch function with the correct query string', () => {
      let calledWith = null
      const fetchFn = url => { calledWith = url }

      searchDb(fetchFn)('someKey')('someDb')(true)('key1=val1', 'key2=val2')
      expect(calledWith).toBe(
        baseUrl + '&apikey=someKey&db=someDb&key1=val1&key2=val2&rettype=count'
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
      expect(() => { byDateTypeAndRange('publication')({ min }) }).toThrow()
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

describe('composeFilters', () => {
  describe('when given one filter', () => {
    const a = 'filter=a'
    it('leaves it unchanged', () => {
      expect(composeFilters(a)).toBe('filter=a')
    })
  })

  describe('when given two filters', () => {
    const [a, b] = ['filter=a', 'filter=b']
    it('joins them correctly', () => {
      expect(composeFilters(a, b)).toBe('filter=a&filter=b')
    })
  })
})

describe('byTerm', () => {
  describe('when supplied with a standard string', () => {
    it('returns the correct filter', () => {
      expect(byTerm('cancer')).toBe('term=cancer')
    })
  })

  describe('when supplied with a string with html characters', () => {
    it('returns the correct filter', () => {
      expect(byTerm('<script>')).toBe('term=%3Cscript%3E')
    })
  })
})

describe('getResultCount', () => {
  describe('when supplied with a good response', () => {
    const input = {
      esearchresult: {
        count: '10'
      }
    }

    it('should return the right count', () => {
      expect(getResultCount(input)).toBe(10)
    })
  })

  describe('when supplied with response missing count', () => {
    const input = {
      esearchresult: {
        nothing: '10'
      }
    }
    it('should throw', () => {
      expect(() => { getResultCount(input) }).toThrow()
    })
  })

  describe('when supplied with response missing esearch', () => {
    const input = {
      something: 'else'
    }
    it('should throw', () => {
      expect(() => { getResultCount(input) }).toThrow()
    })
  })
})
