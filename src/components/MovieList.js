import React, { useState, useEffect, useRef } from 'react'
import Pagination from 'react-bootstrap/Pagination';
import Movie from './Movie'
import hasIntersection from './../util/hasIntersection'
import { sortMoviesAlphabetically, sortMoviesByRanking, sortMoviesByPopularity, sortMoviesByDate } from './../util/sortMovies'
import { searchMovie, fetchPopular } from './../api/api_handler'

const MovieList = ({ favouriteMovies, movies, handleMovieClick, handleFavouritesClick, showMovies, showSeries, unselectedGenres, sortParameter, numberOfMovies, type, searchValue }) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [maxPageNumberReached, setMaxPageNumberReached] = useState(1)
    const [shouldFetchNextPage, setShouldFetchNextPage] = useState(false)
    const [shouldUpdateMovies, setShouldUpdateMovies] = useState(false)
    const moviesRef = useRef() // stores movies that where just fetched and appended to the original movies array, before thay can be passed on to the original array

    // rerenders the component to update 'movies'
    useEffect(() => {
        if(shouldUpdateMovies === true)
            setShouldUpdateMovies(false)
    }, [shouldUpdateMovies])

    useEffect(() => {
        const fetchNextPage = async () => {
            if(type === "search") {
                console.log("SEARCH")
                let searchResults = await searchMovie(searchValue, pageNumber)
                moviesRef.current = movies.concat(searchResults)
                setShouldUpdateMovies(true)
            }
            else if (type === "movie") {
                console.log("MOVIE")
                console.log(await fetchPopular("movie", pageNumber))
                // put in local storage
            }
            else if (type === "tv") {
                console.log("TV")
                console.log(await fetchPopular("tv", pageNumber))
                // put in local storage
            }
        }

        if(shouldFetchNextPage) {
            fetchNextPage()
            setShouldFetchNextPage(false)
        }
    }, [shouldFetchNextPage])

    if(moviesRef.current != null) {
        movies = moviesRef.current
        numberOfMovies = movies.length
    }

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

    const startIndex = pageNumber === 1? 0 : 10*(pageNumber-1) // avoids negative index if at the start of array
    const endIndex = (10*pageNumber-1) > numberOfMovies? numberOfMovies-1 : (10*pageNumber-1) // avoids array out of bounds if at the end of array
    const pageOfMovies = movies.slice(startIndex, endIndex+1)

    console.log(`pageNumber: ${pageNumber} - startIndex: ${startIndex} - endIndex: ${endIndex} - numberOfMovies: ${numberOfMovies}`)

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
                                    {
                                        pageNumber === 1?
                                        <>
                                            <Pagination.Prev disabled id="pagination"/>
                                        </>
                                        :
                                        <>
                                            <Pagination.Prev id="pagination" onClick={() => {setPageNumber(pageNumber - 1)}}/>
                                        </>
                                    }
                                    <Pagination.Next id="pagination" 
                                        onClick={
                                            () => {
                                                let newPageNumber = pageNumber + 1 // used for the next if conditional because the value of the state 'pageNumber' updates asynchronously
                                                setPageNumber(newPageNumber)
                                                if((newPageNumber % 2 === 1) && (newPageNumber > maxPageNumberReached)) {
                                                    setMaxPageNumberReached(newPageNumber)
                                                    setShouldFetchNextPage(true)
                                                }
                                            }
                                        }
                                    />
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
