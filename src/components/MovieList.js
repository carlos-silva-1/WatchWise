import React from 'react'
import truncateText from './../util/truncate'
import hasIntersection from './../util/hasIntersection'
import { sortMoviesAlphabetically, sortMoviesByRanking, sortMoviesByPopularity, sortMoviesByDate } from './../util/sortMovies'

const MovieList = ({ favouriteComponent, dropdownComponent, streamOptions, favouriteMovies, movies, handleMovieClick, handleStreamMouseEnter, handleFavouritesClick, showMovies, showSeries, unselectedGenres, sortParameter }) => {
    const FavouriteComponent = favouriteComponent
    const DropdownComponent = dropdownComponent

    if(movies != null) {
        if(sortParameter.toLowerCase() === "alphabetically")
            sortMoviesAlphabetically(movies)
        else if(sortParameter.toLowerCase() === "ranking")
            sortMoviesByRanking(movies)
        else if(sortParameter.toLowerCase() === "popularity")
            sortMoviesByPopularity(movies)
        else if(sortParameter.toLowerCase() === "release date")
            sortMoviesByDate(movies)
    }

    if(movies != null){
        return(
            <>
                {movies.map( (movie, index) => (
                    <>
                        {
                            // renders the item if its a movie and 'showMovies' is checked, or if its a series and 'showSeries' is checked &&
                            // renders the item if none of its genres are in 'unselectedGenres' &&
                            // renders the item it it has a poster
                            ((showMovies && "release_date" in movie) || (showSeries && "first_air_date" in movie)) &&
                            !hasIntersection(movie.genre_ids, unselectedGenres) && 
                            movie.poster_path != null? 
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
