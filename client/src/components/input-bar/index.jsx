import Input from '~/components/input'
import PropTypes from 'prop-types'
import React from 'react'

const validateYear = year => /[1-9][0-9]{3}/.test(year) ? [true, ''] : [false, 'Not a valid year']
const validateDisease = disease => [true, ''] // TODO: do we want validation?

const InputBar = ({ submit, setSelection }) => {
  const onFromChange = value => setSelection('from', parseInt(value))
  const onToChange = value => setSelection('to', parseInt(value))
  const onDiseaseChange = value => setSelection('disease', value)

  return (
    <div className='input-bar'>
      <Input
        placeholder='From...'
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
      <Input
        placeholder='Disease...'
        onChange={onDiseaseChange}
        validate={validateDisease}
      />
      <button onClick={() => submit(true)}>Submit</button>
    </div>
  )
}

InputBar.propTypes = {
  setSelection: PropTypes.func,
  submit: PropTypes.func
}

export default InputBar
