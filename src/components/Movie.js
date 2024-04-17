import React from 'react'
import Drop from './Dropdown';
import Favourite from './Favourite';
import truncateText from './../util/truncate'

// should 'handleMovieClick', 'handleStreamMouseEnter' and 'handleFavouritesClick' be defined in this file?

const Movie = ({ movieData, handleMovieClick, handleStreamMouseEnter, streamOptions, handleFavouritesClick, favouriteMovies }) => {
	return(
        <>
        	<div className='d-flex justify-content-start m-3 image-container'>
                <img src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} alt='movie poster'
                    onClick={() => handleMovieClick(movieData)}></img>

                <div className='overlay stream-overlay d-flex align-items-center justify-content-center'
                     onMouseEnter={() => handleStreamMouseEnter(movieData)}>
                    <Drop streamOptions={streamOptions}/>
                </div>
                
                <div className='overlay favourite-overlay d-flex align-items-center justify-content-center'
                     onClick={() => handleFavouritesClick(movieData)}>
                    <Favourite favouriteMovies={favouriteMovies} movie={movieData}/>
                </div>

                <div className='overlay title-overlay d-flex align-items-center justify-content-center'>
                    {
                        movieData.title !== undefined?
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

export default Movie
