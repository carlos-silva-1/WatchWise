import React from 'react'
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types'

const getIMDBID = async (movie) => {
    const url = "release_date" in movie? 
                `https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_KEY}`
                :
                `https://api.themoviedb.org/3/tv/${movie.id}/external_ids?api_key=${process.env.REACT_APP_TMDB_KEY}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`
      }
    }

    try {
        const response = await fetch(url, options)
        const responseJSON = await response.json()
        return responseJSON.imdb_id
    } catch (error) {
        console.error(error)
    }
}

const goToIMDBPage = async (movie) => {
    const imdb_id = await getIMDBID(movie)

    if(imdb_id){
      const imdbUrl = `https://www.imdb.com/title/${imdb_id}`
      window.open(imdbUrl)
    }
}

const IMDB = ({ movie }) => {
    return(
        <>
            <Button variant="outline-warning" className="p-2 mt-2" id='imdb-btn' onClick={() => goToIMDBPage(movie)}>
                IMDB
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right ml-2 mb-1" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                    <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                </svg>
            </Button>
        </>
    )
}

IMDB.propTypes = {
    movie: PropTypes.object.isRequired
}

export default IMDB

export { getIMDBID, goToIMDBPage }
