import React from 'react'
import truncateText from './../util/truncate'

const MovieList = ({ favouriteComponent, dropdownComponent, streamOptions, favouriteMovies, movies, handleMovieClick, handleStreamMouseEnter, handleFavouritesClick, showMovies, showSeries }) => {
    const FavouriteComponent = favouriteComponent
    const DropdownComponent = dropdownComponent
    
    if(movies != null){
        return(
            <>
                {movies.map( (movie, index) => (
                    <>
                        {
                            (showMovies && "release_date" in movie) || (showSeries && "first_air_date" in movie)?
                                <>
                                    {
                                        movie.poster_path != null? // if the film doesn't have a poster image, the movie is not included
                                            <>
                                                <div className='d-flex justify-content-start m-3 image-container' key={index}>
                                                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie'
                                                        onClick={() => handleMovieClick(movie)}></img>

                                                    <div className='overlay stream-overlay d-flex align-items-center justify-content-center'
                                                         onMouseEnter={() => handleStreamMouseEnter(movie)}>
                                                        <DropdownComponent streamOptions={streamOptions}/>
                                                    </div>
                                                    
                                                    <div className='overlay favourite-overlay d-flex align-items-center justify-content-center'
                                                         onClick={() => handleFavouritesClick(movie)}>
                                                        <FavouriteComponent favouriteMovies={favouriteMovies} movie={movie}/>
                                                    </div>

                                                    <div className='overlay title-overlay d-flex align-items-center justify-content-center'>
                                                        {
                                                            movie.title !== undefined?
                                                                <>
                                                                    {truncateText(movie.title, 30)}
                                                                </>
                                                            :
                                                                <>
                                                                    {truncateText(movie.name, 30)}
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        :
                                            <>
                                            </>
                                    }
                                </>
                            :
                                <>
                                </>
                        }
                    </>
                ))}
            </>
        )
    }
    else{
        return(
            <>
            </>
        )
    }
    
}

export default MovieList