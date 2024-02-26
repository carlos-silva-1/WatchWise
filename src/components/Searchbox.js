import React from 'react'

const Searchbox = (props) => {
    return(
        <div className='col-sm-3'>
            <input className='form-control searchbox' placeholder='Search'
                   value={props.searchValue} 
                   onChange={(event) => props.setSearchValue(event.target.value)}></input>
        </div>
    )
}

export default Searchbox