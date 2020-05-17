import Chart from '~/components/chart'
import InputBar from '~/components/input-bar'
import React, { useEffect, useState } from 'react'

const reqUrl = process.env.SERVER_HOST + '/search'
const formatRequest = ({ from, to, disease }) => `${reqUrl}?from=${from}&to=${to}&disease=${disease}`

const App = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(true)
  const [selection, setSelection] = useState({ from: 2014, to: 2020, disease: 'cancer' })
  const [showing, setShowing] = useState(selection)

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
      setShowing(selection)
      setHasSubmitted(false)
    }

    fetchData()
  }, [hasSubmitted])

  return (
    <div className='app'>
      <InputBar isLoading={isLoading} submit={setHasSubmitted} setSelection={setSelectionProp} />
      <div className='chart-title'>
        <h1>Total mentions for &lsquo;{showing.disease}&rsquo; between {showing.from} and {showing.to}</h1>
      </div>
      <Chart isLoading={isLoading} isError={isError} className='chart' data={data} />
    </div>
  )
}

export default App
