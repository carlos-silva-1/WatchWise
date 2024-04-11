import React from 'react'

const Searchbox = ({ searchValue, setSearchValue }) => {
    return(
        <div className='col-sm-3'>
            <input className='form-control searchbox' placeholder='Search'
                   value={searchValue} 
                   onChange={(event) => setSearchValue(event.target.value)}></input>
        </div>
    )
}

export default Searchbox