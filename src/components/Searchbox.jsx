import React from 'react'
import PropTypes from 'prop-types'

const Searchbox = ({ searchValue, setSearchValue }) => {
    return(
        <div>
            <input className='form-control mt-3 bg-light-custom text-light searchbox' placeholder='Search'
                   value={searchValue} 
                   onChange={(event) => setSearchValue(event.target.value)}></input>
        </div>
    )
}

Searchbox.propTypes = {
    searchValue: PropTypes.string.isRequired,
    setSearchValue: PropTypes.func.isRequired
}

export default Searchbox