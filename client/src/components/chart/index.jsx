import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'
import React from 'react'

const messages = {
  loading: 'Loading data...',
  error: 'Could not load data'
}

const Chart = ({ data, isLoading, isError }) => {
  const msg = isError ? messages.error : isLoading ? messages.loading : null

  // eslint can't handle ternaries like this
  /* eslint-disable */
  return (
    <ResponsiveContainer className='chart'>
      {msg
        ? <div className='loader'><p>{msg}</p></div>
        : <BarChart data={data}>
          <CartesianGrid />
          <XAxis dataKey='year' />
          <YAxis />
          <Bar dataKey='count' fill='#6D829A' />
        </BarChart>}
    </ResponsiveContainer>
  )
  /* eslint-enable */
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number,
    count: PropTypes.number
  })),
  isError: PropTypes.bool,
  isLoading: PropTypes.bool
}

export default Chart
