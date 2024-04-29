import React from 'react'

const Searchbox = ({ searchValue, setSearchValue }) => {
    return(
        <div>
            <input className='form-control mt-3 bg-light-custom text-light searchbox' placeholder='Search'
                   value={searchValue} 
                   onChange={(event) => setSearchValue(event.target.value)}></input>
        </div>
    )
}

export default Searchbox