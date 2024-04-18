import React from 'react'
import Pagination from 'react-bootstrap/Pagination';
import Movie from './Movie'
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

                <div className="container">
                    {
                        movies.length <= 10?
                        <>
                            <div className="row d-flex justify-content-center mt-3 mr-5">
                                <Pagination className="mr-5">
                                    <Pagination.Prev disabled id="pagination-disabled"/>
                                    <Pagination.Next disabled id="pagination-disabled"/>
                                </Pagination>
                            </div>
                        </>
                        :
                        <>
                            <div className="row d-flex justify-content-center mt-3 mr-5">
                                <Pagination className="mr-5">
                                    <Pagination.Prev id="pagination"/>
                                    <Pagination.Next id="pagination"/>
                                </Pagination>
                            </div>
                        </>
                    }
                </div>
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
