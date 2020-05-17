import Chart from '~/components/chart'
import InputBar from '~/components/input-bar'
import React, { useEffect, useState } from 'react'

const reqUrl = 'http://localhost:3000/search' // FIXME: make env
const formatRequest = ({ from, to, disease }) => `${reqUrl}?from=${from}&to=${to}&disease=${disease}`

const App = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(true)
  const [selection, setSelection] = useState({ from: 2020, to: 2020, disease: 'cancer' })

  function setSelectionProp (key, value) {
    const newSelection = { ...selection }
    newSelection[key] = value
    setSelection(newSelection)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!hasSubmitted) return

      setIsError(false)
      setIsLoading(true)

      try {
        const result = await fetch(formatRequest(selection))
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

  // TODO: remove the inline styling of this
  // TODO: chart needs a title somewhere
  return (
    <div className='app'>
      <InputBar isLoading={isLoading} submit={setHasSubmitted} setSelection={setSelectionProp} />
      <Chart isLoading={isLoading} isError={isError} className='chart' data={data} />
    </div>
  )
}

export default App
