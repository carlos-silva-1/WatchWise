import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import Searchbox from './components/Searchbox';
import MovieDetails from './components/MovieDetails';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Filter from './components/Filter';
import Sort from './components/Sort';
import genres from './resources/genres.json';
import { searchMovie, fetchPopular, getDetails } from './api/api_handler'
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import useLocalStorage from './hooks/useLocalStorage'
import { LIST_TYPE } from './components/MovieList';

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [popularMovies, setPopularMovies] = useState([])
  const [popularSeries, setPopularSeries] = useState([])
  const [favourites, setFavourites] = useState([])

  const [movieHasBeenSelected, setMovieHasBeenSelected] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState({})

  const [showMovies, setShowMovies] = useState(true)
  const [showSeries, setShowSeries] = useState(true)
  const [unselectedGenres, setUnselectedGenres] = useState([])
  
  const [sortParameter, setSortParameter] = useState('')

  const [showFilterOverlay, setShowFilterOverlay] = useState(false)
  const [showSortOverlay, setShowSortOverlay] = useState(false)
  const filterRef = useRef(null)
  const sortRef = useRef(null)
  
  const [popularMoviesLocalStorage, setPopularMoviesLocalStorage] = useLocalStorage('popular-movies', [])
  const [popularSeriesLocalStorage, setPopularSeriesLocalStorage] = useLocalStorage('popular-series', [])
  const [favouritesLocalStorage, setFavouritesLocalStorage] = useLocalStorage('favourites', [])
  const [lastUpdateDate, setLastUpdateDate] = useLocalStorage('last-update-date', new Date(1971, 1, 1))

  useEffect(() => {
    const fetchSearchResults = async () => {
      const fetchedMovies = await searchMovie(searchValue)
      setSearchResults(fetchedMovies)
    }

    fetchSearchResults()
  }, [searchValue])

  useEffect(() => {
    setFavourites(favouritesLocalStorage)
  }, [])

  useEffect(() => { // Updates popular movies/series once per day
    const currentDate = new Date().toLocaleDateString();

    const fetchPopularMoviesAndSeries = async () => {
      const fetchedMovies = await fetchPopular("movie")
      const fetchedSeries = await fetchPopular("tv")
      setPopularMovies(fetchedMovies)
      setPopularSeries(fetchedSeries)
      setPopularMoviesLocalStorage(fetchedMovies)
      setPopularSeriesLocalStorage(fetchedSeries)
      setLastUpdateDate(currentDate)
    }
    
    if (lastUpdateDate !== currentDate) {
      fetchPopularMoviesAndSeries()
    }
    else {
      setPopularMovies(popularMoviesLocalStorage)
      setPopularSeries(popularSeriesLocalStorage)
    }
  }, []);

  const handleFavouriteMovie = async (movie) => {
    let favouriteMoviesIDs = []
    if(favourites != null)
      favouriteMoviesIDs = favourites.map(obj => obj.id);
    
    if(favouriteMoviesIDs.includes(movie.id)) {
      removeFavouriteMovie(movie)
    }
    else {
      addFavouriteMovie(movie)
    }
  }

  const addFavouriteMovie = async (movie) => {
    let newFavouriteList = []

    if(favourites !== null)
      newFavouriteList = [...favourites, movie]
    else
      newFavouriteList = [movie]

    setFavourites(newFavouriteList)
    setFavouritesLocalStorage(newFavouriteList)
  }

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => (
      favourite.id !== movie.id
    ))
    setFavourites(newFavouriteList)
    setFavouritesLocalStorage(newFavouriteList)
  }

  const showMovieDetails = async (movie) => {
    setMovieHasBeenSelected(true)
    setSelectedMovie(movie)
  }

  return (
    <div className="position-relative">

      {/* HEADER */}
      <div id="header" className='d-flex justify-content-between bg-dark-custom z-1'>
        <Navbar expand="lg" variant="dark" className="pl-5">
          <Container>
            <Navbar.Brand href="/index.html" id='brand'>MyMovieQueue</Navbar.Brand>
            <Navbar.Toggle id="navbar-hamburger-icon"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Item className="mr-2">
                  <Button id="filter-btn" variant="outline-warning" ref={filterRef} onClick={() => setShowFilterOverlay(prevShowFilter => !prevShowFilter)}>Filter &#x25BC;</Button>
                  <Overlay target={filterRef.current} show={showFilterOverlay} placement="bottom">
                    {(props) => (
                      <Tooltip id="tooltip-overlay" {...props}>
                        <Filter showMovies={showMovies} showSeries={showSeries} 
                        changeShowMovies={() => setShowMovies(prevShowMovies => !prevShowMovies)} changeShowSeries={() => setShowSeries(prevShowSeries => !prevShowSeries)} 
                        genres={genres} unselectedGenres={unselectedGenres} setUnselectedGenres={setUnselectedGenres}/>
                      </Tooltip>
                    )}
                  </Overlay>
                </Nav.Item>

                <Nav.Item>
                  <Button id="sort-btn" variant="outline-warning" ref={sortRef} onClick={() => setShowSortOverlay(prevShowSort => !prevShowSort)}>Sort &#x25BC;</Button>
                  <Overlay target={sortRef.current} show={showSortOverlay} placement="bottom">
                    {(props) => (
                      <Tooltip id="tooltip-overlay" {...props}>
                        <Sort sortParameter={sortParameter} setSortParameter={setSortParameter}/>
                      </Tooltip>
                    )}
                  </Overlay>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="d-flex justify-content-end pr-4 mr-5">
          <Searchbox searchValue={searchValue} setSearchValue={setSearchValue}/>
          <Button variant="outline-warning" className="m-3" id='login-btn'>Login</Button>
          <Button variant="outline-warning" className="mt-3" id='sign-up-btn'>Sign Up</Button>
        </div>
      </div>

      <div>
        {/* BODY */}
        {
          // If a movie has been clicked, show its details
          movieHasBeenSelected === true?
          <>
            <MovieDetails movie={selectedMovie} />
          </>
          :
          <>
            {
              // IF A SEARCH IS BEING MADE, ONLY SHOW THE SEARCH RESULTS. ELSE SHOW MOVIE QUEUES
              searchValue !== ''?
              <>
                {/* SEARCH RESULTS */}
                <div className="movie-queue">
                  <div className='d-flex justify-content-center'>
                    <MovieListHeading heading='Search Results'/>
                  </div>

                  <div className="d-flex justify-content-center">
                    <MovieList movies={searchResults} listType={LIST_TYPE.SEARCH_RESULTS} searchValue={searchValue}
                    sortParameter={sortParameter} unselectedGenres={unselectedGenres}
                    showMovies={showMovies} showSeries={showSeries}
                    handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                    handleMovieClick={showMovieDetails} />
                  </div>
                </div>
              </>
              :
              <>
                {/* MY MOVIE QUEUE */}
                {
                  favourites != null && favourites.length !== 0 && 
                  (showMovies === true || showSeries === true)?
                  <>
                    <div className="movie-queue pb-5 mt-5">
                      <div className='d-flex justify-content-center'>
                        <MovieListHeading heading='My Movie Queue'/>
                      </div>

                      <div className="d-flex justify-content-center">
                        <MovieList movies={favourites} listType={LIST_TYPE.FAVOURITES}
                        sortParameter={sortParameter} unselectedGenres={unselectedGenres}
                        showMovies={showMovies} showSeries={showSeries}
                        handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites} 
                        handleMovieClick={showMovieDetails}/>
                      </div>
                    </div>
                  </>
                  :
                  <>
                  </>
                }

                {/* POPULAR MOVIES QUEUE */}
                {
                  showMovies === true?
                  <>
                    <div className="movie-queue pb-5 mt-5">
                      <div className='d-flex justify-content-center'>
                        <MovieListHeading heading='Popular Movies'/>
                      </div>

                      <div className="d-flex justify-content-center">
                        <MovieList movies={popularMovies} listType={LIST_TYPE.POPULAR_MOVIES}
                        sortParameter={sortParameter} unselectedGenres={unselectedGenres}
                        showMovies={showMovies} showSeries={showSeries} 
                        handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites} 
                        handleMovieClick={showMovieDetails}/>
                      </div>
                    </div>
                  </>
                  :
                  <>
                  </>
                }

                {/* POPULAR SERIES QUEUE */}
                {
                  showSeries === true?
                  <>
                    <div className="movie-queue mt-5">
                      <div className='d-flex justify-content-center'>
                        <MovieListHeading heading='Popular Series'/>
                      </div>

                      <div className="d-flex justify-content-center">
                        <MovieList movies={popularSeries} listType={LIST_TYPE.POPULAR_SERIES}
                        sortParameter={sortParameter} unselectedGenres={unselectedGenres}
                        showMovies={showMovies} showSeries={showSeries}
                        handleFavouritesClick={handleFavouriteMovie} favouriteMovies={favourites}
                        handleMovieClick={showMovieDetails}/>
                      </div>
                    </div>
                  </>
                  :
                  <>
                  </>
                }
              </>
            }
          </>
        }
      </div>
    </div>
  );
}

export default App;
