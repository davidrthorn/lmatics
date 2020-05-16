const { searchDb, assembleDateFilter } = require('ncbi')

describe('test search DB', () => {
  it('should call fetch with a valid query when good input', () => {
    let calledWith = null
    const fetchFn = url => { calledWith = url }

    searchDb(fetchFn)('someDb')('key1=val1&key2=val2')
    expect(calledWith).toBe('db=someDb&key1=val1&key2=val2')
  })
})
