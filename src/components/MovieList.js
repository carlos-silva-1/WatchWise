import React from 'react'
import Drop from './Dropdown';
import Favourite from './Favourite';
import Movie from './Movie'
import truncateText from './../util/truncate'
import hasIntersection from './../util/hasIntersection'
import { sortMoviesAlphabetically, sortMoviesByRanking, sortMoviesByPopularity, sortMoviesByDate } from './../util/sortMovies'

const MovieList = ({ favouriteMovies, movies, handleMovieClick, handleFavouritesClick, showMovies, showSeries, unselectedGenres, sortParameter, pageNumber = 1, numberOfMovies }) => {
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

    const startIndex = pageNumber === 1? 0 : 10*(pageNumber-1)
    const endIndex = (10*pageNumber-1) > numberOfMovies? numberOfMovies-1 : (10*pageNumber-1)
    const pageOfMovies = movies.slice(startIndex, endIndex+1)

    if(pageOfMovies != null){
        return(
            <>
                {pageOfMovies.map( (movie, index) => (
                    <>
                        {
                            // renders the item if its a movie and 'showMovies' is checked, or if its a series and 'showSeries' is checked &&
                            // renders the item if none of its genres are in 'unselectedGenres' &&
                            // renders the item it it has a poster
                            ((showMovies && "release_date" in movie) || (showSeries && "first_air_date" in movie)) &&
                            !hasIntersection(movie.genre_ids, unselectedGenres) && 
                            movie.poster_path != null? 
                            <>
                                <Movie movieData={movie} handleMovieClick={handleMovieClick} handleFavouritesClick={handleFavouritesClick} favouriteMovies={favouriteMovies} />
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
