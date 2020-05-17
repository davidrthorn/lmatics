import PropTypes from 'prop-types'
import React, { useState } from 'react'

const Input = ({
  onChange = null,
  validate = null,
  maxLength = '',
  placeholder = ''
}) => {
  const [err, setErr] = useState('')

  const change = el => {
    if (!validate) {
      onChange(el.target.value)
      return
    }

    const [valid, message] = validate(el.target.value)
    if (!valid) {
      setErr(message)
      return
    }
    setErr(null)
    onChange(el.target.value)
  }

  return (
    <div>
      <input type='text' placeholder={placeholder} maxLength={maxLength} onChange={change} />
      {err && <div className='input-err'>{err}</div>}
    </div>
  )
}

Input.propTypes = {
  maxLength: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  validate: PropTypes.func
}

export default Input
