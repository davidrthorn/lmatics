import Chart from '../chart'
import Input from '~/components/input'
import React, { useEffect, useState } from 'react'

const validateYear = year => /[1-9][0-9]{3}/.test(year) ? [true, ''] : [false, 'Not a valid year']
const validateDisease = disease => [true, ''] // TODO: do we want validation?

const App = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      try {
        const result = await fetch('http://localhost:3000/search?testparam=hello') // TODO: replace this placeholder
        const body = await result.json()
        setData(body.data)
      } catch (err) {
        setIsError(true)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  console.log(isError, isLoading) // TODO: remove this

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
