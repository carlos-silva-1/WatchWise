import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const Favourite = ({ favouriteMovies, movie }) => {
    const [movieIDs, setMovieIDs] = useState([])

    useEffect(() => {
        if(favouriteMovies != null && favouriteMovies.length !== 0)
            setMovieIDs(favouriteMovies.map(obj => obj.id))
    }, [favouriteMovies])

    return(
        <>
            {
                movieIDs.includes(movie.id)?
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi bi-x" viewBox="0 0 11 13">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </>
                :
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi bi-plus" viewBox="0 0 11 13">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </>
            }
        </>
    )
}

Favourite.propTypes = {
    favouriteMovies: PropTypes.array.isRequired,
    movie: PropTypes.object.isRequired
}

export default Favourite