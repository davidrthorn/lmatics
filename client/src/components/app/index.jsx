import Input from '~/components/input'
import React from 'react'

const validateYear = year => /[1-9][0-9]{3}/.test(year) ? [true, ''] : [false, 'Not a valid year']

const App = () => {
  return (
    <div width='100vw' height='100vh'>
      <Input validate={validateYear} />
    </div>
  )
}

export default App
