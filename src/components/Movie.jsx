import React from 'react'
import Stream from './Stream';
import Favourite from './Favourite';
import truncateText from './../util/truncate'
import poster_not_available from './../poster_not_available.jpg'
import PropTypes from 'prop-types'

const Movie = ({ movieData, handleMovieClick, handleFavouritesClick, favouriteMovies }) => {
	return(
        <>
        	<div className='d-flex justify-content-start m-3 image-container'>
        		{
        			movieData.poster_path != undefined?
        			<>
        				<img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} alt='movie poster'
                    	onClick={() => handleMovieClick(movieData)}></img>
        			</>
        			:
        			<>
        				<img src={poster_not_available} alt='movie poster'
                    	onClick={() => handleMovieClick(movieData)}></img>
        			</>
        		}

                <div className='overlay stream-overlay text-dark'>
                    <Stream movie={movieData}/>
                </div>
                
                <div className='pl-1 pb-2 overlay favourite-overlay text-dark'
                     onClick={() => handleFavouritesClick(movieData)}>
                    <Favourite favouriteMovies={favouriteMovies} movie={movieData}/>
                </div>

                <div className='d-flex align-items-center justify-content-center w-100 overlay title-overlay text-dark'>
                    {
                        movieData.title != undefined?
                        <>
                            {truncateText(movieData.title, 30)}
                        </>
                        :
                        <>
                            {truncateText(movieData.name, 30)}
                        </>
                    }
                </div>
            </div>
        </>
    )
}

Movie.propTypes = {
    movieData: PropTypes.object.isRequired,
    handleMovieClick: PropTypes.func.isRequired,
    handleFavouritesClick: PropTypes.func.isRequired,
    favouriteMovies: PropTypes.array.isRequired
}

export default Movie
