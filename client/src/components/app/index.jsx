import Chart from '~/components/chart'
import InputBar from '~/components/input-bar'
import React, { useEffect, useState } from 'react'
import Status from '~/components/status'

const reqUrl = 'http://localhost:3000/search' // FIXME: make env

const App = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [selection, setSelection] = useState({ from: 2018, to: 2020, disease: 'cancer' })

  function setSelectionProp (key, value) {
    const newSelection = { ...selection }
    newSelection[key] = value
    setSelection(newSelection)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      try {
        const result = await fetch(`${reqUrl}?from=${selection.from}&to=${selection.to}&disease=${selection.disease}`) // TODO: extract this url formatting function
        const body = await result.json()
        setData(body.data)
      } catch (err) {
        setIsError(true)
      }

      setIsLoading(false)
      setHasSubmitted(false)
    }

    fetchData()
  }, [hasSubmitted])

  return (
    <div width='100vw' height='100vh'>
      <InputBar submit={setHasSubmitted} setSelection={setSelectionProp} />
      <Status isLoading={isLoading} isError={isError} />
      <Chart data={data} />
    </div>
  )
}

export default App
