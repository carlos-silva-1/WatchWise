import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import PropTypes from 'prop-types'
import { getIMDBID } from './IMDB'

const Stream = ({ movie }) => {
    const [streamOptions, setStreamOptions] = useState([])

    const updateStreamOptions = async (movie) => {
        const imdb_id = await getIMDBID(movie)
        const url = `https://streaming-availability.p.rapidapi.com/v2/get/basic?country=us&imdb_id=${imdb_id}&output_language=en`;
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
          }
        }

        try {
          const response = await fetch(url, options);
          const responseJSON = await response.json();
          const streamingOptions = responseJSON.result.streamingInfo

          if(Object.keys(streamingOptions).length !== 0){
            const streamingOptionsUS = streamingOptions.us // The API only provides info for the US region
            const streamingOptionsUSEntries = Object.entries(streamingOptionsUS)
            setStreamOptions(streamingOptionsUSEntries)
          }
          else{
            const noStreamingOptions = {}
            setStreamOptions(noStreamingOptions)
          }
        } catch (error) {
          console.error(error);
        }
    }

    return(
        <div onMouseEnter={() => updateStreamOptions(movie)}>
            <Dropdown>
                <Dropdown.Toggle variant="warning" className="dropdown-btn">
                    Stream
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu">
                    {streamOptions.map((option) => (
                        <Dropdown.Item className="dropdown-item" href={option[1][0].link} target="_blank" key={option[0].toString()}>
                            {option[0].toString().toUpperCase()}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

Stream.propTypes = {
  movie: PropTypes.object.isRequired
}

export default Stream
