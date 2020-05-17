const handle = require('./handle')

const resolveJsonWith = (payload, status) => ({
  json: () => { return payload },
  status: status
})

const makeEsearchResponse = count => ({ esearchresult: { count: count } })

describe('getCountForTermInYearRange', () => {
  describe('when given a range and a term', () => {
    it('should return an array of correct objects', async () => {
      let called = 0
      const mockCount = (...filters) => {
        expect(filters[0]).toEqual(expect.stringContaining('cancer'))
        called++
        return resolveJsonWith(
          makeEsearchResponse(called === 1 ? 100 : called), // 100 for the first query, successive ints otherwise
          200
        )
      }

      const got = await handle.getCountForTermInYearRange(mockCount)({
        disease: 'cancer',
        from: 1990,
        to: 1993
      })

      expect(called).toBe(5)

      expect(got).toEqual([
        { year: 1993, count: 2 },
        { year: 1992, count: 3 },
        { year: 1991, count: 4 },
        { year: 1990, count: 5 }
      ])
    })
  })

  describe('when given a range and a term', () => {
    it('should return an array of correct objects', async () => {
      let called = 0
      const mockCount = _ => {
        called++
        return resolveJsonWith(
          makeEsearchResponse(called === 1 ? 6 : called), // 6 for the first query, successive ints otherwise
          200
        )
      }

      const got = await handle.getCountForTermInYearRange(mockCount)({
        disease: 'cancer',
        from: 1990,
        to: 1993
      })

      expect(called).toBe(4) // because we accounted for total mentions by 1991

      expect(got).toEqual([
        { year: 1993, count: 2 },
        { year: 1992, count: 3 },
        { year: 1991, count: 4 }
      ])
    })
  })
})
