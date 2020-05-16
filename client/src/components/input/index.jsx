import PropTypes from 'prop-types'
import React, { useState } from 'react'

const Input = ({ validate, placeholder = '' }) => {
  const [err, setErr] = useState('')

  const onChange = el => {
    const [valid, message] = validate(el.target.value)
    setErr(!valid ? message : '')
  }

  return (
    <div>
      <input type='text' placeholder={placeholder} maxLength='4' onChange={onChange} />
      {err !== '' && <div className='input-err'>{err}</div>}
    </div>
  )
}

Input.propTypes = {
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

export default Input
