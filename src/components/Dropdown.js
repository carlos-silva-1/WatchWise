import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'


const Drop = (props) => {
    const StreamOptions = Object.entries(props.streamOptions)

    return(
        <Dropdown className="dropdown-btn">
            <Dropdown.Toggle variant="warning" id="dropdown-basic" className="dropdown-btn">
                Stream
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
                {StreamOptions.map((option) => (
                    <Dropdown.Item className="dropdown-item" href={option[1][0].link} target="_blank" key={option[0].toString()}>
                        {option[0].toString().toUpperCase()}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Drop
