import Chart from '../chart'
import Input from '~/components/input'
import React, { useState } from 'react'

const validateYear = year => /[1-9][0-9]{3}/.test(year) ? [true, ''] : [false, 'Not a valid year']
const validateDisease = disease => [true, ''] // TODO: do we want validation?

const App = () => {
  const [data, setData] = useState([])

  return (
    <div width='100vw' height='100vh'>
      <Input placeholder='From...' maxLength='4' validate={validateYear} />
      <Input placeholder='To year...' maxLength='4' validate={validateYear} />
      <Input placeholder='Disease...' validate={validateDisease} />
      <Chart data={data} />
    </div>
  )
}

export default App
