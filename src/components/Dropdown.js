import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'


const Drop = (props) => {
    const StreamOptions = Object.entries(props.streamOptions)

    return(
        <Dropdown>
            <Dropdown.Toggle variant="warning" id="dropdown-basic">
                Stream
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {StreamOptions.map((option) => (
                    <Dropdown.Item href={option[1][0].link} target="_blank" key={option[0].toString()}>
                        {option[0].toString().toUpperCase()}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Drop
