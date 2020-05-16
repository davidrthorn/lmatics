import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import React from 'react'

// TODO: replace
const testData = [{
  year: 2019,
  count: 1000
},
{
  year: 2018,
  count: 300
}]

const Chart = () => {
  return (
    <ResponsiveContainer height={600} width='100%'>
      <BarChart data={testData}>
        <CartesianGrid />
        <XAxis dataKey='year' />
        <YAxis />
        <Bar dataKey='count' fill='#A3CFAC' />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
