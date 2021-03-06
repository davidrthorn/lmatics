import Input from '~/components/input'
import PropTypes from 'prop-types'
import React from 'react'

const validateYear = year => /[1-9][0-9]{3}/.test(year) ? [true, ''] : [false, 'Not a valid year']

const InputBar = ({ isLoading = false, submit, setSelection }) => {
  const onFromChange = value => setSelection('from', parseInt(value))
  const onToChange = value => setSelection('to', parseInt(value))
  const onDiseaseChange = value => setSelection('disease', value)

  return (
    <div className='input-bar'>
      <Input
        placeholder='Disease...'
        onChange={onDiseaseChange}
      />
      <Input
        placeholder='From year...'
        maxLength='4'
        onChange={onFromChange}
        validate={validateYear}
      />
      <Input
        placeholder='To year...'
        maxLength='4'
        onChange={onToChange}
        validate={validateYear}
      />
      <div>
        <button disabled={isLoading} onClick={() => submit(true)}>Plot</button>
      </div>
    </div>
  )
}

InputBar.propTypes = {
  isLoading: PropTypes.bool,
  setSelection: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired
}

export default InputBar
