import PropTypes from 'prop-types'
import React, { useState } from 'react'

const Input = ({ validate, maxLength = '', placeholder = '' }) => {
  const [err, setErr] = useState('')

  const onChange = el => {
    const [valid, message] = validate(el.target.value)
    setErr(!valid ? message : '')
  }

  return (
    <div>
      <input type='text' placeholder={placeholder} maxLength={maxLength} onChange={onChange} />
      {err !== '' && <div className='input-err'>{err}</div>}
    </div>
  )
}

Input.propTypes = {
  maxLength: PropTypes.string,
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

export default Input
