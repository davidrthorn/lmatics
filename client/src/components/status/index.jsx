import PropTypes from 'prop-types'
import React from 'react'

const messages = {
  loading: 'Loading data...',
  error: 'Could not load data'
}

export const Status = ({ isLoading, isError }) => {
  const msg = isError ? messages.error : isLoading ? messages.loading : null
  // TODO: Spinner?
  return (
    <div className='status'>
      {msg && <p>blah</p>}
    </div>
  )
}

Status.propTypes = {
  isError: PropTypes.bool,
  isLoading: PropTypes.bool
}
