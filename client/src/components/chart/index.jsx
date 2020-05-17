import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import PropTypes from 'prop-types'
import React from 'react'

const Chart = ({ data }) => {
  // TODO: consider removing this inline styling
  return (
    <ResponsiveContainer height={600} width='100%'>
      <BarChart data={data}>
        <CartesianGrid />
        <XAxis dataKey='year' />
        <YAxis />
        <Bar dataKey='count' fill='#6D829A' />
      </BarChart>
    </ResponsiveContainer>
  )
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.number,
    count: PropTypes.number
  }))
}

export default Chart
