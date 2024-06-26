import React, { useState, useEffect } from 'react'
import Pagination from 'react-bootstrap/Pagination';
import Movie from './Movie'
import hasIntersection from './../util/hasIntersection'
import { sortMovies } from './Sort'
import { searchMovie, fetchPopular } from './../api/api_handler'
import PropTypes from 'prop-types'
import useLocalStorage from './../hooks/useLocalStorage'
import { isMovie, isSeries } from './../util/movieUtils'

const LIST_TYPE = {
    SEARCH_RESULTS: "search_results",
    FAVOURITES: "favourites",
    POPULAR_MOVIES: "popular_movies",
    POPULAR_SERIES: "popular_series"
}

const MovieList = ({ favouriteMovies, movies, handleMovieClick, handleFavouritesClick, showMovies, showSeries, genresToHide, sortParameter, listType, searchValue }) => {
    const [moviesLocalState, setMoviesLocalState] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [shouldFetchNextPage, setShouldFetchNextPage] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [numberMoviesPerPage, setNumberMoviesPerPage] = useState(5)
    const [numberOfFetches, setNumberOfFetches] = useState(1)

    const [lastUpdateDate, setLastUpdateDate] = useLocalStorage('last-update-date', new Date(1971, 1, 1))
    const [popularMoviesLocalStorage, setPopularMoviesLocalStorage] = useLocalStorage('popular-movies', [])
    const [popularSeriesLocalStorage, setPopularSeriesLocalStorage] = useLocalStorage('popular-series', [])

    useEffect(() => { // Updates popular movies once per day
        if(listType === LIST_TYPE.POPULAR_MOVIES) {
            const currentDate = new Date().toLocaleDateString();

            const fetchPopularMovies = async () => {
                const fetchedMovies = await fetchPopular("movie")
                setMoviesLocalState(fetchedMovies)
                setPopularMoviesLocalStorage(fetchedMovies)
                setLastUpdateDate(currentDate)
            }

            if (lastUpdateDate !== currentDate) 
                fetchPopularMovies()
        }
    }, []);

    useEffect(() => { // Updates popular series once per day
        if(listType === LIST_TYPE.POPULAR_SERIES) {
            const currentDate = new Date().toLocaleDateString();

            const fetchPopularSeries = async () => {
                const fetchedSeries = await fetchPopular("tv")
                setMoviesLocalState(fetchedSeries)
                setPopularSeriesLocalStorage(fetchedSeries)
                setLastUpdateDate(currentDate)
            }

            if (lastUpdateDate !== currentDate) 
                fetchPopularSeries()
        }
    }, []);

    const fetchNextPage = async () => {
        if(listType === LIST_TYPE.SEARCH_RESULTS) {
            let searchResults = await searchMovie(searchValue, pageNumber)
            let newMovies = moviesLocalState.concat(searchResults)
            setMoviesLocalState(newMovies)
        }
        else if (listType === LIST_TYPE.POPULAR_MOVIES) {
            let fetchedPopularMovies = await fetchPopular("movie", pageNumber)
            let newMovies = moviesLocalState.concat(fetchedPopularMovies)
            setMoviesLocalState(newMovies)
            localStorage.setItem('react-movie-app-popular-movies', JSON.stringify(newMovies))
        }
        else if (listType === LIST_TYPE.POPULAR_SERIES) {
            let fetchedPopularSeries = await fetchPopular("tv", pageNumber)
            let newMovies = moviesLocalState.concat(fetchedPopularSeries)
            setMoviesLocalState(newMovies)
            localStorage.setItem('react-movie-app-popular-series', JSON.stringify(newMovies))
        }
    }

    const updateNumberMoviesPerPageBasedOnViewportWidth = () => {
        if(windowWidth >= 1845) 
            setNumberMoviesPerPage(5)
        else if(windowWidth < 1845 && windowWidth >= 1485)
            setNumberMoviesPerPage(4)
        else if(windowWidth < 1485 && windowWidth >= 1150 ) 
            setNumberMoviesPerPage(3)
        else if(windowWidth < 1150 && windowWidth >= 770) 
            setNumberMoviesPerPage(2)
        else if(windowWidth < 770) 
            setNumberMoviesPerPage(1)
    }

    const handleResize = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        updateNumberMoviesPerPageBasedOnViewportWidth()
    }, [windowWidth])

    // fetches next page from API if 'Next' pagination button is clicked
    useEffect(() => {
        if(shouldFetchNextPage) {
            fetchNextPage()
            setShouldFetchNextPage(false)
        }
    }, [shouldFetchNextPage])

    useEffect(() => {
        if(listType === LIST_TYPE.POPULAR_MOVIES)
            setMoviesLocalState(popularMoviesLocalStorage)
        if(listType === LIST_TYPE.POPULAR_SERIES)
            setMoviesLocalState(popularSeriesLocalStorage)
        if(listType === LIST_TYPE.FAVOURITES)
            setMoviesLocalState(favouriteMovies)
    }, [])

    useEffect(() => {
        if(listType === LIST_TYPE.SEARCH_RESULTS)
            setMoviesLocalState(movies)
    }, [searchValue, movies])

    useEffect(() => {
        if(listType === LIST_TYPE.FAVOURITES)
            setMoviesLocalState(favouriteMovies)
    }, [favouriteMovies])

    sortMovies(moviesLocalState, sortParameter)

    const startIndex = pageNumber === 1? 0 : numberMoviesPerPage*(pageNumber-1)
    const endIndex = (numberMoviesPerPage*pageNumber-1) > moviesLocalState.length? moviesLocalState.length-1 : (numberMoviesPerPage*pageNumber-1) // avoids array out of bounds if at the end of array
    const pageOfMovies = moviesLocalState.slice(startIndex, endIndex+1)

    if(pageOfMovies != null){
        return(
            <>
                <div>
                    <div className="row">
                        {pageOfMovies.map( (movie, index) => (
                            <div key={index}>
                                {
                                    // renders the item if its a movie and 'showMovies' is checked, or if its a series and 'showSeries' is checked &&
                                    // renders the item if none of its genres are in 'genresToHide'
                                    ((showMovies && isMovie(movie)) || (showSeries && isSeries(movie))) &&
                                    !hasIntersection(movie.genre_ids, genresToHide)? 
                                    <>
                                        <Movie movieData={movie} handleMovieClick={handleMovieClick} handleFavouritesClick={handleFavouritesClick} favouriteMovies={favouriteMovies} />
                                    </>
                                    :
                                    <>
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                
                    <div className="row d-flex justify-content-center mt-3 mr-5 mb-5 pb-3">
                        <Pagination className="mr-5 horizontal-center">
                            {
                                moviesLocalState.length <= numberMoviesPerPage?
                                <>
                                    <Pagination.Prev id="pagination-disabled"/>
                                    <Pagination.Next id="pagination-disabled"/>
                                </>
                                :
                                <>
                                    {
                                        pageNumber === 1?
                                        <>
                                            <Pagination.Prev id="pagination-disabled"/>
                                        </>
                                        :
                                        <>
                                            <Pagination.Prev id="pagination" onClick={() => {setPageNumber(prevPageNumber => prevPageNumber - 1)}}/>
                                        </>
                                    }
                                    {
                                        // should only show a disabled 'next' button if its the 'favourites' list because any other list can have
                                        // a next page if its fetched
                                        listType === LIST_TYPE.FAVOURITES &&
                                        endIndex + 1 >= moviesLocalState.length?
                                        <>
                                            <Pagination.Next id="pagination-disabled" />
                                        </>
                                        :
                                        <>
                                            <Pagination.Next id="pagination" 
                                                onClick={
                                                    () => {
                                                        setPageNumber(prevPageNumber => prevPageNumber + 1)
                                                        // 20 is the number of items fetched in any single fetch
                                                        if(((pageNumber+1) * numberMoviesPerPage) / (20 * numberOfFetches) > 1) {
                                                            setShouldFetchNextPage(true)
                                                            setNumberOfFetches(prevNumberOfFetches => prevNumberOfFetches + 1)
                                                        }
                                                    }
                                                }
                                            />
                                        </>
                                    }
                                </>
                            }
                        </Pagination>
                    </div>
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

MovieList.propTypes = {
    favouriteMovies: PropTypes.array.isRequired,
    movies: PropTypes.array, 
    handleMovieClick: PropTypes.func.isRequired,
    handleFavouritesClick: PropTypes.func.isRequired,
    showMovies: PropTypes.bool.isRequired,
    showSeries: PropTypes.bool.isRequired,
    genresToHide: PropTypes.array.isRequired,
    sortParameter: PropTypes.string.isRequired,
    listType: PropTypes.string.isRequired, 
    searchValue: PropTypes.string
}

export default MovieList
export { LIST_TYPE }
